<script setup lang="ts">
import { store } from './store';

</script>

<template>
    <input type="text" v-model="store.query" placeholder="Buscar canciones..." />
    <button v-if="store.query" @click="store.clearQuery">❌</button>
</template>