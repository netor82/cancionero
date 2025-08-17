<script setup lang="ts">
import type { Lyric, Note } from '@/core/interfaces/lyrics';
import { ref, watch } from 'vue';
import Chord from './Chord.vue';
import lyricsService from '@/core/services/lyrics-service';
import versionService from '@/core/services/version-service';
import type { Tag } from '@/core/interfaces/tag';
import { store } from '@/core/store';
import TagComponent from '@/components/Tag.vue';

const message = ref('')
const lyrics = ref<Lyric | null>(null)
const nota = ref<Note>({ note: 0, position: 0 })
const valor = ref(0)
const myInput = ref<HTMLInputElement | null>(null);

const searchTag = ref('');
const tags = ref<Tag[]>([]);
const options = ref<Tag[]>([]);

function process() {
    if (message.value.length > 0 && !isNaN(+message.value)) {
        lyricsService.get(+message.value).then(l => {
            lyrics.value = l
            message.value = ''
        });
    } else if (lyrics.value && lyrics.value.id > 0) {
        console.log('Saving lyrics', lyrics.value.id);
        lyricsService.save(lyrics.value).then(() => {
            message.value = ''
            lyrics.value = null
        })
    } else if (message.value.trim()) {
        lyrics.value = JSON.parse(message.value) as Lyric;
        message.value = ''
    } else if (lyrics.value) {
        message.value = JSON.stringify(lyrics.value, null, 2)
        lyrics.value = null
    }
}

watch(nota, () => {
    if (nota.value) {
        valor.value = nota.value.position;
        myInput.value?.focus();
        myInput.value?.select();
    }
})

function setPosition() {
    if (nota.value) {
        nota.value.position = valor.value;
    }
}

function reset() {
    localStorage.setItem('cancionero_version', '[0,0,0]');
    versionService.update()
}

watch(searchTag, (newValue) => {
    newValue = newValue.trim().toLocaleLowerCase();
    options.value = newValue
        ? store.tags.filter((tag) =>
            tag.name.toLowerCase().includes(newValue)
            && !tags.value.some(t => t.id === tag.id))
        : [];
});

function addTag(tag: Tag) {
    tags.value.push(tag);
    searchTag.value = '';
}

function removeTag(tag: Tag) {
    tags.value = tags.value.filter(t => t.id !== tag.id);
}

function copyTags() {
    const t = JSON.stringify(tags.value.map(t => t.id).sort());
    navigator.clipboard.writeText(t).then(() => alert('OK'));
}

</script>

<template>
    <input v-model="message" @keyup.enter="process"/>
    <button @click="process">🤖</button>
    <button @click="reset">🗑️</button>

    <input type="number" v-model="valor" @input="setPosition" ref="myInput" />
    {{ lyrics?.id }}

    
    <div v-if="lyrics" class="lyrics-content" style="position:relative;padding-top: 10px;">
        <div class="ruler" style="left:10ch">1</div>
        <div class="ruler" style="left:20ch">2</div>
        <div class="ruler" style="left:30ch">3</div>
        <div class="ruler" style="left:40ch">4</div>
        <div class="ruler" style="left:50ch">5</div>
        <div class="ruler" style="left:60ch">6</div>
        <div v-for="(notes, index) in lyrics.notes" :key="index">
            <p class="chords">
                <Chord v-for="chord in notes" :chord="chord" @click="nota = chord" :transpose="0" />&nbsp;
            </p>
            <p>{{ lyrics.text[index] }}</p>
        </div>

    </div>

    <span class="tag-search">
        <input type="text" v-model="searchTag" placeholder="Etiqueta" />
        <TagComponent v-for="t in options" :id="t.id" :tag="t" :callback="addTag" />
        <TagComponent v-if="!options.length" v-for="t in tags" :id="t.id" :tag="t" :callback="removeTag" />
        <button v-if="tags.length" @click="tags = []">❌</button>
        <button v-if="tags.length" @click="copyTags()">📋</button>
    </span>

</template>

<style>
.ruler {
    font-family: 'Courier New', Courier, monospace;
    border-left: 1px dotted var(--color-border);
    position: absolute;
    top: -15px;
    bottom: 0px;
}
</style>