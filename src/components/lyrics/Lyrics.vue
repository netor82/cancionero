<script setup lang="ts">
import { watch, ref, computed, toRaw } from 'vue'
import { store } from '@/core/store'
import type { Lyric } from '@/core/interfaces/lyrics'
import lyricsService from '@/core/services/lyrics-service'
import projectService from '@/core/services/project-service'
import SongInfo from './SongInfo.vue'
import Chord from './Chord.vue'

const message = ref('Seleccione una canción en el Índice')
const lyrics = ref<Lyric | null>(null)

watch(() => store.song, (newIndex) => {

  if (newIndex) {
    lyricsService.get(newIndex.id).then(value => {
      if (value) {
        message.value = ''
        lyrics.value = value
      } else {
        message.value = `No hay letras para la canción ${newIndex.id}`
        lyrics.value = null
      }
    }).catch(error => {
      console.error(`Error fetching lyrics for song ${newIndex.id}:`, error)
    });
  }

}, { immediate: true });

const transpose = computed(() => {
  if (store.project) {
    const songInProject = store.project.songs.find(s => s.id === store.song?.id)
    return songInProject ? songInProject.transpose : store.transpose
  }
  return store.transpose
})

const changeTranspose = (amount: number) => {
  if (store.project) {
    const songInProject = store.project.songs.find(s => s.id === store.song?.id)
    if (songInProject) {
      songInProject.transpose = calculateTranspose(songInProject.transpose, amount)
      projectService.save(store.project).catch(error => {
        console.error('Error updating project:', error)
      })
      return // exists as change was done to transpose in project
    }
  }
  store.transpose = calculateTranspose(store.transpose, amount)
};

function calculateTranspose(original: number, delta:number): number {
  original += delta
  if  (original < 0) original = 11
  if  (original > 11) original = 0
  return original
}
</script>

<template>
  <div class="lyrics vertical-scroll">
    <SongInfo />
    <p v-if="message" class="vertical-center">{{ message }}</p>

    <div v-if="lyrics" class="lyrics-transponse">
      <div v-if="store.noteConvention !== 2" class="inline">
        <button @click="changeTranspose(-1)">⬇️</button>
        <button @click="changeTranspose(1)">⬆️</button>
      </div>
      <button @click="store.changeNoteConvention()">
        {{ store.noteConvention === 2 ? '🎵' : (store.noteConvention ? '⭕' : '🎶') }}
      </button>
    </div>
    <div v-if="lyrics" class="lyrics-content">
      <div v-for="(notes, index) in lyrics.notes" :key="index">
        <p class="chords" v-if="store.noteConvention !== 2">
          <Chord v-for="chord in notes" :chord="chord" :transpose="transpose" />&nbsp;
        </p>
        <pre>{{ lyrics.text[index] }}&nbsp;</pre>
      </div>

    </div>
  </div>

</template>
<style>
.lyrics button {
  padding: 4px 0;
  margin: 0;
}
.lyrics-transponse {
  display: flex;
  justify-content: right;
  margin-top: 1rem;
}
.lyrics-transponse span {
  margin-top: 4px;
}

.lyrics-content {
  margin-top: 1rem;
  font-family: monospace, 'Courier New', Courier;
}
.lyrics-content p {
  text-wrap: nowrap;
}

.chords {
  position: relative;
  margin-bottom: -10px;
}
</style>