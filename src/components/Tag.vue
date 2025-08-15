<script setup lang="ts">
import { computed} from 'vue'
import TagService from '@/core/services/tag-service';
import type { Tag } from '@/core/interfaces/tag';

const tagService = new TagService()

const props = defineProps<{
  id: number
  tag: Tag | null
  active?: boolean
  callback?: (tag: Tag) => void
}>()

const tag = computed(() => props.tag || tagService.get(props.id) as Tag)



function handleClick() {
  if (props.callback && tag.value) {
    props.callback(tag.value);
  }
}

</script>

<template>
  <span class="tag" @click.stop="handleClick">
    {{ tag?.name }}
  </span>
</template>