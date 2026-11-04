<script setup lang="ts">
import type { Project } from '@/core/interfaces/project'
import { store } from './store'
import { store as gStore } from '@/core/store';
import ProjectSong from './ProjectSong.vue';
import projectService from '@/core/services/project-service';
import { ref } from 'vue';
import { Sections } from '@/core/enums/sections';
import lyricsService from '@/core/services/lyrics-service';
import { notesName, notesNameL, Notes } from '@/core/enums/notes';

const props = defineProps<{
    project: Project
}>()

const originalTitle = ref(props.project.title);

const newNoteItem = ref('');

function saveTitle() {
    if (originalTitle.value !== props.project.title) {
        projectService.save(props.project);
    }
}

const confirmDelete = async () => {
    const confirmed = confirm('¿Seguro de eliminar este proyecto?');
    if (confirmed) {
        await projectService.delete(props.project).then(() => {
            store.projects = store.projects.filter(p => p.id !== props.project.id);
            gStore.project = null;
        });
    }
};

const sharing = ref(false);

const shareProject = async () => {
    if (sharing.value) return;
    sharing.value = true;
    try {
        const url = await projectService.share(props.project);
        if (navigator.share) {
            await navigator.share({ title: props.project.title, url });
        } else {
            await navigator.clipboard.writeText(url);
            alert('Enlace copiado al portapapeles');
        }
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Error al compartir la lista:', error);
        alert('No se pudo compartir la lista');
    } finally {
        sharing.value = false;
    }
};

const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const printProject = async () => {
    const pages: string[] = [];
    for (const ps of props.project.songs) {
        if (!ps.id) { // project note
            if (ps.label) pages.push(`<section><h2>${escapeHtml(ps.label)}</h2></section>`);
            continue;
        }
        const song = gStore.songs.find(s => s.id === ps.id);
        const lyric = await lyricsService.get(ps.id);
        if (!lyric) continue;
        const showChords = gStore.noteConvention !== 2;
        const names = gStore.noteConvention ? notesName : notesNameL;
        let body = '';
        lyric.text.forEach((line, i) => {
            if (showChords) {
                const chords = (lyric.notes[i] ?? []).map(c =>
                    `<span class="c" style="margin-left:${c.position}ch">${escapeHtml(names[((c.note + ps.transpose) % 12) as Notes] + (c.chord ?? ''))}</span>`
                ).join('');
                body += `<div class="ch">${chords}&nbsp;</div>`;
            }
            body += `<pre>${escapeHtml(line)}&nbsp;</pre>`;
        });
        pages.push(`<section><h2>${escapeHtml(song?.title ?? String(ps.id))}</h2>${song?.author ? `<h3>${escapeHtml(song.author)}</h3>` : ''}${body}</section>`);
    }
    if (pages.length === 0) {
        alert('No hay letras para imprimir');
        return;
    }
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(props.project.title)}</title>
<style>
body{font-family:monospace,'Courier New',Courier;margin:0;color:#000}
section{page-break-after:always;break-after:page}
section:last-child{page-break-after:auto;break-after:auto}
h2{margin:0 0 .2em;font-family:sans-serif}
h3{margin:0 0 1em;font-family:sans-serif;font-weight:normal}
pre{margin:0;font-family:inherit;white-space:pre-wrap}
.ch{white-space:nowrap;position:relative;height:1.3em;margin-top:.3em}
.c{position:absolute;left:0;font-weight:bold}
</style></head><body>${pages.join('')}</body></html>`;
    const frame = document.createElement('iframe');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
    document.body.appendChild(frame);
    frame.onload = () => {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
        setTimeout(() => frame.remove(), 1000);
    };
    frame.srcdoc = html;
};

const cloneProject = async () => {
    await projectService.clone(props.project).then((created) => {
        store.projects.unshift(created);
        gStore.project = created;
    });
};

const addNote = () => {
    if (newNoteItem.value.trim()) {
        props.project.songs.push({
            id: 0,
            transpose: 0,
            label: newNoteItem.value.trim()
        });
        projectService.save(props.project).catch(error => {
            console.error('Error saving project:', error);
        });
        newNoteItem.value = '';
    }
};


const swapSong = (indexA: number, indexB: number) => {
    const temp = props.project.songs[indexA];
    props.project.songs[indexA] = props.project.songs[indexB];
    props.project.songs[indexB] = temp;
    projectService.save(props.project).catch(error => {
        console.error('Error saving project:', error);
    });
};

</script>

<template>
    <div class="controls">
        <slot name="controls" />
        <div class="inline">
            <button @click="cloneProject">🈁Clonar</button>
            <button @click="confirmDelete">❌Borrar</button>
            <button @click="shareProject" :disabled="sharing">📤Compartir</button>
            <button @click="printProject">🖨️Imprimir</button>
        </div>
    </div>
    <div class="project">
        <input type="text" v-model="props.project.title" @focusin="originalTitle = props.project.title"
            @focusout="saveTitle()" />
        <p class="date">{{ store.dateFormat(props.project.date) }}</p>

        <ul>
            <ProjectSong v-for="(s, i) in props.project.songs" :key="s.id || -i" :project="props.project" :id="s.id || -i" :index="i" :label="s.label">
                <template #controls>
                    <button @click.stop="swapSong(i, i - 1)" v-if="i > 0">⬆️</button>
                    <button @click.stop="swapSong(i, i + 1)"
                        :class="{ invisible: i >= props.project.songs.length - 1 }">⬇️</button>
                </template>
            </ProjectSong>
        </ul>

        <div v-if="props.project.songs.length === 0" class="vertical-center">
            <p>Para cambiar el título de la lista, puedes dar doble clic sobre el título.</p>
            <p>😅</p>
            <p>No tienes nada en esta lista.</p>
            <p>Ve al <a @click.stop="gStore.section.setActive(Sections.Songs)">Índice</a>, entra en la letra de una canción y añádela a esta lista.</p>
        </div>

        <div class="project-addNote-form">
            <h5>Agregar nota a la lista:</h5>
            <input v-model="newNoteItem" placeholder="Añadir nota" />
            <button @click="addNote" :class="{'invisible': !newNoteItem}" >➕</button>
        </div>
    </div>
</template>

<style scoped>
input {
    background: none;
    font-size: x-large;
    border: none;
    padding: 0;
    width: 100%;
}

input:focus {
    background: initial;
    border: initial;
    padding: 6px 8px;
}

.project-addNote-form {
    margin-top: 16px;
}
.project-addNote-form input{
    width: 75%;
    font-size: large;
}
</style>