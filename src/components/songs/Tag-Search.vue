<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import type { Tag } from '@/core/interfaces/tag';
import { store as songStore } from './store';
import { store } from '@/core/store';
import TagComponent from '@/components/Tag.vue';

const searchTag = ref('');
const options = reactive( { i: [] as Tag[] });

watch(searchTag, (newValue) => {
    newValue = newValue.trim().toLocaleLowerCase();
    options.i = newValue
        ? store.tags.filter((tag) => 
            tag.name.toLowerCase().includes(newValue)
            && !songStore.tags.some(t => t.id === tag.id))
        : [];
});

function addTag(tag: Tag) {
    songStore.addTag(tag);
    searchTag.value = '';
}

function removeTag(tag: Tag) {
    songStore.removeTag(tag);
}

</script>



<template>
    <span class="tag-search">
        <input type="text" v-model="searchTag" placeholder="Buscar por etiqueta..." />
        <TagComponent v-for="t in options.i" :id="t.id" :tag="t" :callback="addTag" />
        <TagComponent v-if="!options.i.length" v-for="t in songStore.tags" :id="t.id" :tag="t"
            :callback="removeTag" :class="{ active: songStore.tags.includes(t) }" />
        <button v-if="songStore.tags.length" @click="songStore.clearTags">❌</button>
    </span>
</template>
