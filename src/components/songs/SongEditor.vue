<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import { store } from '@/core/store';
import type { Tag } from '@/core/interfaces/tag';
import TagComponent from '@/components/Tag.vue';

const songIds = ref('');
const myText = ref<HTMLTextAreaElement | null>(null);

const searchTag = ref('');
const tags = ref<Tag[]>([]);
const options = ref<Tag[]>([]);
const tagId = computed(() => {
    return tags.value.length > 0 ? tags.value[0].id : 0;
});

watch(searchTag, (newValue) => {
    newValue = newValue.trim().toLocaleLowerCase();
    options.value = newValue
        ? store.tags.filter((tag) =>
            tag.name.toLowerCase().includes(newValue)
            && !tags.value.some(t => t.id === tag.id))
        : [];
});

function addTag(tag: Tag) {
    tags.value = [tag];
    searchTag.value = '';
}

function removeTag(tag: Tag) {
    tags.value = tags.value.filter(t => t.id !== tag.id)
}

function applyTag() {
    if (myText.value && tags.value.length > 0) {
        const ids = songIds.value.split(',').map(id => { 
            if(id === "352B") return 374;
            if(id === "352C") return 375;
            if(id === "187B") return 376;
            if(id === "111B") return 377;
            return Number(id.trim())
        });
        for(const id of ids) {
            const song = store.songs.find(s => s.id === id);
            if (song && !song.tags.some(t => t == tags.value[0].id)) {
                song.tags.push(tags.value[0].id)
            }
        }
        songIds.value = ''
        tags.value = []
    }
}

function printSongs() {
    if (myText.value) {
        myText.value.value = store.songs.slice().sort((a, b) => a.id - b.id).map(song => JSON.stringify(song)).join(',\n')
    }
}

</script>

<template>
    <div>
        <div>
            <span class="tag-search">
                <input type="text" v-model="searchTag" placeholder="Etiqueta" />
                <TagComponent v-for="t in options" :id="t.id" :tag="t" :callback="addTag" />
                <TagComponent v-if="!options.length" v-for="t in tags" :id="t.id" :tag="t" :callback="removeTag" />
                <button v-if="tags.length" @click="tags = []">❌</button>
                <span>{{ tagId }}</span>
            </span>
            <div>
                <input type="text" v-model="songIds" placeholder="IDs de canciones (separados por comas)" />
                <button @click="applyTag">🤖</button>
                <button @click="printSongs">🗒️</button>
                <br />
                <textarea ref="myText"> </textarea>
            </div>
        </div>
    </div>

</template>