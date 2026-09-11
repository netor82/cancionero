<script setup lang="ts">
import Lyrics from './components/lyrics/Lyrics.vue'
import Songs from './components/songs/Songs.vue';
import { Sections } from './core/enums/sections'
import { onMounted } from 'vue'
import { initiator } from './core/loader/initiator';
import { store } from './core/store';
import Editor from './components/lyrics/Editor.vue';
import SongEditor from './components/songs/SongEditor.vue';
import Projects from './components/projects/Projects.vue';
import Version from './components/version/Version.vue';
import projectService from './core/services/project-service';
import { store as projectsStore } from './components/projects/store';

const localhost = window.location.hostname === 'localhost';
const editMode = localhost || window.location.search.indexOf('edit=1') > 0;

onMounted(async () => {
    await initiator.init();
    await importSharedProject();
})

async function importSharedProject() {
    const match = window.location.hash.match(/#list-id=([^&]+)/);
    if (!match) return;

    const id = decodeURIComponent(match[1]);
    history.replaceState(null, '', window.location.pathname + window.location.search);

    try {
        const project = await projectService.importFromShare(id);
        projectsStore.projects.push(project);
        store.project = project;
        store.section.setActive(Sections.Projects);
    } catch (error) {
        console.error('Error al importar la lista compartida:', error);
        alert('No se pudo importar la lista compartida');
    }
}

function active(s: Sections):void {
    store.section.setActive(s);
}
</script>

<template>
  <div class="app-layout">
    <header>
      <div class="wrapper">
        <button @click="active(Sections.Songs)" :class="{active: store.section.active === Sections.Songs}">🔍Índice</button>
        <button @click="active(Sections.Projects)" :class="{active: store.section.active === Sections.Projects}">📁Listas</button>
        <button @click="active(Sections.Editor)" v-if="editMode" :class="{active: store.section.active === Sections.Editor}">🖊️Editor</button>
        <button @click="active(Sections.SongEditor)" v-if="localhost" :class="{active: store.section.active === Sections.SongEditor}">📝</button>
        <button @click="active(Sections.Lyrics)" class="hidden-big" :class="{active: store.section.active === Sections.Lyrics}">🎵Letras</button>
        <Version />
      </div>
    </header>

    <main>
      <section :class="{ active: store.section.active === Sections.Projects || store.section.active === Sections.Songs }"
      v-if="store.section.last === Sections.Songs" >
        <div class="wrapper">
          <Songs />
        </div>
      </section>

      <section :class="{ active: store.section.active === Sections.Projects || store.section.active === Sections.Songs }"
        v-if="store.section.last === Sections.Projects" >
        <div class="wrapper">
          <Projects />
        </div>
      </section>

      <section :class="{ active: store.section.active === Sections.Editor }"
        v-if="store.section.last === Sections.Editor">
        <div class="wrapper">
          <Editor />
        </div>
      </section>
      <section :class="{ active: store.section.active === Sections.SongEditor }"
        v-if="store.section.last === Sections.SongEditor">
        <div class="wrapper">
          <SongEditor />
        </div>
      </section>

      <section :class="{ active: store.section.active === Sections.Lyrics }">
        <div class="wrapper">
          <Lyrics />
        </div>
      </section>

    </main>

    <footer>
      <div class="wrapper">
        <p>Made with ❤️ by <a href="https://github.com/netor82" target="_blank">Neto</a></p>
      </div>
    </footer>
  </div>
</template>
