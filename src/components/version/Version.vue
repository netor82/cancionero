<script setup lang="ts">
import { ref } from 'vue';
import versionService from '@/core/services/version-service'
import Loading from '../Loading.vue';

const version = ref<string>(versionService.get())
const loading = ref(false)

function refreshVersion() {
    if (!loading.value) {
        loading.value = true
        versionService.update().then(v => {
            version.value = v;
            loading.value = false;
        }).catch(() => {
            version.value = '0.0.0';
            loading.value = false;
        });
    }
}

</script>

<template>
    <div v-if="!loading" class="inline">
        - v{{ version }}
        <button class="refresh-button" @click="refreshVersion">🔁</button>
    </div>
    <Loading v-else />
</template>

<style>
.refresh-button {
    padding-left: 0;
}
</style>