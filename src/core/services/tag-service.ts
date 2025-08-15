import type { Tag } from '@/core/interfaces/tag';
import { compareTags } from '@/core/interfaces/tag';
import { store } from '../store';
const STORAGE_KEY = 'cancionero_tags';

export default class TagService {

    private static instance : TagService;

    constructor() {
        if (TagService.instance) return TagService.instance;
        TagService.instance = this;
        this.load();
    }

    async load() {
        if (store.tags.length) return;
        try {
            const storedTags = localStorage.getItem(STORAGE_KEY);
            if (storedTags) {
                store.tags = JSON.parse(storedTags) as Tag[];
            }
            else {
                const tags = await fetchTags();
                store.tags = tags;
                save(tags);
            }
        } catch (error) {
            console.error('Error loading tags from localStorage:', error);
        }
    }

    async unload() {
        store.tags = [];
        localStorage.removeItem(STORAGE_KEY);
    }
    
    get(id: number): Tag | undefined {
        return store.tags.find(tag => tag.id === id);
    }
}


async function fetchTags(): Promise<Tag[]> {
    const response = await fetch('./tags.json');
    if (!response.ok) {
        throw new Error('Failed to fetch tags');
    }
    return response.json().then((data: Tag[]) => {data.sort(compareTags); return data});
}

function save(items: Tag[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Error saving tags to localStorage:', error);
    }
}