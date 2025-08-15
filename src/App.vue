<script setup lang="ts">
import Lyrics from './components/lyrics/Lyrics.vue'
import Songs from './components/songs/Songs.vue';
import { Sections } from './core/enums/sections'
import { onMounted } from 'vue'
import { initiator } from './core/loader/initiator';
import { store } from './core/store';
import Editor from './components/lyrics/Editor.vue';
import Projects from './components/projects/Projects.vue';


onMounted(() => {
    initiator.init();
})
</script>

<template>
  <div class="app-layout">
    <header>
      <div class="wrapper">
        <button @click="store.section.setActive(Sections.Songs)">🔍</button>
        <button @click="store.section.setActive(Sections.Projects)">📁</button>
        <button @click="store.section.setActive(Sections.Editor)">🖊️</button>
        <button @click="store.section.setActive(Sections.Lyrics)" class="hidden-big">🎵</button>
        <button >🔁</button>
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
