<script setup lang="ts">
import type { Note } from '@/core/interfaces/lyrics';
import { notesName, notesNameL, Notes } from '@/core/enums/notes';
import { computed } from 'vue';
import { store } from '@/core/store';

const props = defineProps<{
    chord: Note
    transpose: number
}>()

const noteName = computed(() => {
    let index = (props.chord.note + props.transpose) % 12;
    return (store.noteConvention ? notesName : notesNameL)[index as Notes];
});

</script>

<template>
    <span class="chord" :style="{ 'margin-left': chord.position + 'ch' }">
        {{ noteName }}{{ chord.chord }}
    </span>
</template>

<style>
.chord {
    position: absolute;
    left: 0;
    color: var(--color-green);
    background-color: var(--color-background-soft);
    padding-bottom: 12px;
    border-bottom-right-radius: 30px;
    border-left: 1px solid var(--color-border);
    border-top-right-radius: 15px;
}

.lyrics-content pre {
    position: relative;
    z-index: 10;
}
</style>