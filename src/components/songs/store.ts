import { reactive } from "vue";
import type { Tag } from "@/core/interfaces/tag";
import { compareTags } from '@/core/interfaces/tag';

export const store = reactive({
    query: '',
    tags: [] as Tag[],
    clearQuery() {
      this.query = '';
    },
    addTag(tag: Tag) {
                  if (!this.tags.some(t => t.id === tag.id)) {
                      this.tags.push(tag)
                      this.tags.sort(compareTags)
                  }
    },
    removeTag(tag: Tag) {
      this.tags = this.tags.filter(t => t.id !== tag.id);
    },
    clearTags() {
      this.tags = [];
    }

})