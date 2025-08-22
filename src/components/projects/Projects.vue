<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AddProject from './AddProject.vue';
import { store } from './store';
import { store as gStore } from '@/core/store';
import Project from './Project.vue';

const file = ref<File | null>(null)
const showUpload = ref(false)

onMounted(async () => {
  store.projects = await store.service.getAll()
})

const data = computed(() => store.projects.sort((a, b) => {
  if (a.date < b.date) return 1;
  if (a.date > b.date) return -1;
  return 0;
}));

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    store.service.import(file).then(project => {
      store.projects.push(project);
      showUpload.value = false
    });
  }
}

</script>

<template>
  <div class="projects">
    
    <div v-if="!gStore.project">
      <div class="controls">
        <button @click="showUpload = !showUpload" title="Importar">{{ showUpload ? '🔙' : '📤Importar' }} </button>
        <input v-if="showUpload" type="file" ref="file" accept=".json" @change="handleFileUpload" />
  
        <AddProject v-if="!showUpload" />
      </div>
      
      <ul>
        <li v-for="project in data" @click="gStore.project = project">
          <span class="title">{{ project.title }}</span>
          <span class="key">{{ store.dateFormat(project.date) }}</span>
        </li>
      </ul>
    </div>

    <div v-else>
      
      <Project :project="gStore.project">
        <template #controls>
          <button @click="gStore.project = null">🔙Volver</button>
        </template>
      </Project>
    </div>

  </div>
</template>

<style>
.projects .key {
  font-size: smaller;
  color: var(--color-text);
  margin-left: 1em;
}

</style>