import type { Tag } from '@/core/interfaces/tag';
import { compareTags } from '@/core/interfaces/tag';
import { store } from '../store';
const STORAGE_KEY = 'cancionero_tags';

class TagService {

    private static instance: TagService;

    private constructor() { }

    static getInstance() {
        if (!TagService.instance) TagService.instance = new TagService();
        return TagService.instance;
    }

    async load() {
        if (store.tags.length) return;
        try {
            const storedTags = localStorage.getItem(STORAGE_KEY);
            if (storedTags) {
                store.tags = JSON.parse(storedTags) as Tag[];
            }
            else {
                await this.loadFromServer();
            }
        } catch (error) {
            console.error('Error loading tags from localStorage:', error);
        }
    }

    async loadFromServer() {
        const tags = await this.fetchTags();
        store.tags = tags;
        this.save(tags);
    }

    async unload() {
        store.tags = [];
        localStorage.removeItem(STORAGE_KEY);
    }

    get(id: number): Tag | undefined {
        return store.tags.find(tag => tag.id === id);
    }

    private async fetchTags(): Promise<Tag[]> {
        const response = await fetch('./tags.json');
        if (!response.ok) {
            throw new Error('Failed to fetch tags');
        }
        return response.json().then((data: Tag[]) => { data.sort(compareTags); return data });
    }

    private save(items: Tag[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving tags to localStorage:', error);
        }
    }
}

export default TagService.getInstance()
