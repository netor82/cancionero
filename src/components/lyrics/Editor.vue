<script setup lang="ts">
import type { Lyric, Note } from '@/core/interfaces/lyrics';
import { computed, ref, watch } from 'vue';
import Chord from './Chord.vue';
import lyricsService from '@/core/services/lyrics-service';
import versionService from '@/core/services/version-service';
const isLocalHost = window.location.hostname === 'localhost';
import type { Tag } from '@/core/interfaces/tag';
import { store } from '@/core/store';
import songService from '@/core/services/song-service';
import type { Song } from '@/core/interfaces/song';

const message = ref('')
const lyricIdInput = ref('')
const song = computed<Song | undefined>(() => {
    return songService.get(lyrics.value?.id || null)
} )
const lyrics = ref<Lyric | null>(null)
const nota = ref<Note | null>(null)
const positionValue = ref(0)
const notaPosition = ref<HTMLInputElement | null>(null);

const originalText = ref<HTMLTextAreaElement | null>(null);

const searchTag = ref('');
const tags = ref<Tag[]>([]);
const options = ref<Tag[]>([]);

let mouseXInitialPosition = -1;

function loadLyrics() {
    if (lyricIdInput.value.length > 0 && !isNaN(+lyricIdInput.value)) {
        lyricsService.get(+lyricIdInput.value).then(l => {
            if (l!= null) {
                message.value = ''
                lyrics.value = l
                lyricIdInput.value = ''
            } else {
                message.value = `No lyrics found for id ${lyricIdInput.value}`
            }
        });
    }
}

function saveLyric() {
    if (!lyrics.value) return;
    lyricsService.save(lyrics.value).then(() => {
        message.value = `🎉 Lyrics saved successfully!`
    }).catch((error) => {
        message.value = `Error: ${error.message}`
    });
}

watch(nota, () => {
    if (nota.value) {
        positionValue.value = nota.value.position;
        notaPosition.value?.focus();
        notaPosition.value?.select();
    }
})

function setPosition() {
    if (nota.value) {
        nota.value.position = positionValue.value;
    }
}

function reset() {
    localStorage.setItem('cancionero_version', '[0,0,0]');
    versionService.update()
}

function clear() {
    lyrics.value = null;
    nota.value = null;
}

watch(searchTag, (newValue) => {
    newValue = newValue.trim().toLocaleLowerCase();
    options.value = newValue
        ? store.tags.filter((tag) =>
            tag.name.toLowerCase().includes(newValue)
            && !tags.value.some(t => t.id === tag.id))
        : [];
});

function onMouseDown(event: MouseEvent, chord:Note) {
    mouseXInitialPosition = event.clientX;
    nota.value = chord;
    console.log('Mouse down at', mouseXInitialPosition);
}

function onMouseUp(event: MouseEvent) {
    if (mouseXInitialPosition === -1) return; // No initial position set

    const deltaX = event.clientX - mouseXInitialPosition;
    console.log('Mouse up at', event.clientX, 'Delta:', deltaX);
    if (nota.value && Math.abs(deltaX) > 10) { // Threshold to avoid accidental clicks
        nota.value.position += Math.ceil(deltaX / 14) // Adjust position based on mouse movement
        positionValue.value = nota.value.position
    }
    mouseXInitialPosition = -1; // Reset after processing
}

function processOriginalText() {
    if (originalText.value != null && originalText.value.value.trim()) {
        if(parseFromTextToLyric(originalText.value.value.trim())) {
            originalText.value.value = ''
        }
    } else {
        message.value = 'Pegue algo de texto'
    }
}

const fromNameToNote = (name: string, index: number) => {
    name = name.trim().toLowerCase()
    let note = 0

    if (name.startsWith('sol')) {
        note = 7
        name = name.substring(3).trim()
    }
    else {
        switch (name.substring(0, 2)) {
            case 'do':
                note = 0
                break
            case 're':
                note = 2
                break
            case 'mi':
                note = 4
                break
            case 'fa':
                note = 5
                break
            case 'la':
                note = 9
                break
            case 'si':
                note = 11
                break
        }
        name = name.substring(2)
    }

    if (name.startsWith('#')) {
        note++
        name = name.substring(1).trim()
    }
    return {
        note,
        chord: name,
        position: index * 5
    };
}

const processNotes = (line: string) : Note[] => {
    const notes = []

    // split line by any whitespace and return array of notes
    const parts = line.split(/\s+/)
    for (let i = 0; i < parts.length; i++) {
        const note = fromNameToNote(parts[i], i)
        notes.push(note)
    }

    return notes
}

function parseFromTextToLyric(text:string):boolean {
    // split text into lines
    const lines = text.split('\n')
    let firstLine = lines[0].trim()

    if(firstLine === "352B") firstLine = "374";
    if(firstLine === "352C") firstLine = "375";
    if(firstLine === "187B") firstLine = "376";
    if(firstLine === "111B") firstLine = "377";

    const id = Number(firstLine.trim())
    if (isNaN(id) || id == 0){
        message.value = "Me falta el id"
        return false
    }

    let lyricLines = [] , lyricNotes = [] as Note[][]

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) {
            lyricLines.push('')
            lyricNotes.push([])
            continue
        }

        lyricLines.push(lines[i + 1])
        lyricNotes.push(processNotes(lines[i]))
        i++
    }
    lyrics.value = {
        id: id,
        text: lyricLines,
        notes: lyricNotes
    } as Lyric
    return true
}

function exportLyrics() {
    lyricsService.getAll().then((allLyrics) => {
        const blob = new Blob([JSON.stringify(allLyrics)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'letras.json'
        a.click()
        URL.revokeObjectURL(url)
    });
}

</script>

<template>
    <div style="overflow: auto;" id="editor">
        <div>
            <h3>Editar acordes</h3>
            <input v-model="lyricIdInput" @keyup.enter="loadLyrics" placeholder="Id existente + enter" />
            <button @click="reset" v-if="isLocalHost">🗑️</button>
            <input v-if="nota !== null" type="number" v-model="positionValue" @input="setPosition" ref="notaPosition" />
            <div v-if="lyrics">
                <span>Id: {{ lyrics?.id }} - {{ song?.title }}</span>
                <button @click="clear">🔙</button>
            </div>
            <h2>{{ message }}</h2>
            <br /><br />
            <div v-if="!lyrics">
                <textarea ref="originalText" placeholder="Pegar texto aquí"
                    style="height: 300px;width: 100%;"></textarea>
                <button @click="processOriginalText">🤖</button>
                <button @click="exportLyrics">📤</button>
            </div>
        </div>

        <div v-if="lyrics" class="lyrics-content" style="position:relative;padding-top: 10px;font-size:22px" @mouseup.left.prevent="onMouseUp">
            <button @click="saveLyric">💾</button>
            <div class="ruler" style="left:10ch">1</div>
            <div class="ruler" style="left:20ch">2</div>
            <div class="ruler" style="left:30ch">3</div>
            <div class="ruler" style="left:40ch">4</div>
            <div class="ruler" style="left:50ch">5</div>
            <div class="ruler" style="left:60ch">6</div>
            <div v-for="(notes, index) in lyrics.notes" :key="index">
                <p class="chords">
                    <Chord v-for="chord in notes" :chord="chord" :transpose="0" 
                    @mousedown.left.prevent="onMouseDown($event, chord)" />&nbsp;
                </p>
                <pre>{{ lyrics.text[index] }}</pre>
            </div>
        </div>
    </div>



</template>

<style>
.ruler {
    font-family: 'Courier New', Courier, monospace;
    border-left: 1px dotted var(--color-border);
    position: absolute;
    top: -15px;
    bottom: 0px;
}
#editor .chord{
    cursor: pointer;
}
</style>