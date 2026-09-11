<script setup lang="ts">
import { watch, ref, computed, toRaw } from 'vue'
import { store } from '@/core/store'
import type { Lyric } from '@/core/interfaces/lyrics'
import lyricsService from '@/core/services/lyrics-service'
import projectService from '@/core/services/project-service'
import SongInfo from './SongInfo.vue'
import Link from './Link.vue'
import Chord from './Chord.vue'

const message = ref('Seleccione una canción en el Índice')
const lyrics = ref<Lyric | null>(null)

const DEFAULT_FONT_SIZE = 1
const FONT_STEP = 0.1
const MIN_FONT_SIZE = 0.5
const MAX_FONT_SIZE = 2
const fontSize = ref(DEFAULT_FONT_SIZE)

const changeFontSize = (delta: number) => {
  const next = Math.round((fontSize.value + delta) * 10) / 10
  fontSize.value = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, next))
}

const scrollContainer = ref<HTMLElement | null>(null)
const autoScrolling = ref(false)
let scrollIntervalId: ReturnType<typeof setInterval> | null = null

function stopAutoScroll() {
  if (scrollIntervalId) {
    clearInterval(scrollIntervalId)
    scrollIntervalId = null
  }
  autoScrolling.value = false
}

function startAutoScroll() {
  autoScrolling.value = true
  scrollIntervalId = setInterval(() => {
    const el = scrollContainer.value
    if (!el) return
    el.scrollTop += 1
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      stopAutoScroll()
    }
  }, 50)
}

function toggleAutoScroll() {
  if (autoScrolling.value) {
    stopAutoScroll()
  } else {
    startAutoScroll()
  }
}

watch(() => store.song, () => {
  stopAutoScroll()
  fontSize.value = DEFAULT_FONT_SIZE
})

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
  } else if (store.projectNote) {
    message.value = ''
    lyrics.value = null
  } else {
    message.value = 'Seleccione una canción en el Índice'
    lyrics.value = null
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
  <div class="lyrics vertical-scroll" ref="scrollContainer">
    <SongInfo />
    <p v-if="message" class="vertical-center">{{ message }}</p>

    <div v-if="lyrics" class="lyrics-controls">
      <div v-if="store.noteConvention !== 2" class="inline">
        <button @click="changeTranspose(-1)">⬇️</button>
        {{ !transpose ? '-' : '+' + transpose }}
        <button @click="changeTranspose(1)">⬆️</button>
      </div>
      <button @click="store.changeNoteConvention()">
        {{ store.noteConvention === 2 ? '🎵' : (store.noteConvention ? '⭕' : '🎶') }}
      </button>
      <button @click="toggleAutoScroll">
        {{ autoScrolling ? '⏸️' : '▶️' }}
      </button>
      <button @click="changeFontSize(-FONT_STEP)">➖<small>A</small></button>
      <button @click="changeFontSize(FONT_STEP)">A➕</button>
    </div>
    <Link :song="store.song" />
    <div v-if="lyrics" class="lyrics-content" :style="{ fontSize: fontSize + 'em' }">
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
}
.lyrics-controls button {
  font-size: 1.5rem;
  padding: 8px 12px;
}
.lyrics-controls > button:last-child {
  margin-left: -18px;
}
.lyrics-controls {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  position: sticky;
  top: 0;
  z-index: 11;
}
.lyrics-controls span {
  margin-top: 4px;
}

.lyrics-content {
  margin-top: 1rem;
  font-family: monospace, 'Courier New', Courier;
}

.chords {
  position: relative;
  margin-bottom: -10px;
}
</style>