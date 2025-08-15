<script setup lang="ts">
import { ref } from 'vue';
import { store } from './store';

const newProjectTitle = ref('')

const addProject = async () => {
  if (newProjectTitle.value.trim()) {
    const project = await store.service.add(newProjectTitle.value)
    store.projects.unshift(project)
    newProjectTitle.value = '';
  }
}
</script>

<template>
  <div class="add-project inline">
    <input v-model="newProjectTitle" placeholder="Añadir lista" />
    <button @click="addProject" :class="{'invisible': !newProjectTitle}" >➕</button>
  </div>
</template>

