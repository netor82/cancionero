import { store } from '../store';
import type { Lyric } from '../interfaces/lyrics';
import _const from '../enums/const';
import BaseDbService, { StoreName } from './basedb-service';
import { deepToRaw } from '../utils/deepToRaw';



class LyricsService extends BaseDbService {
    private static instance : LyricsService;

    private constructor() {
        super(StoreName.LYRICS);
    }

    static getInstance() {
        if (!LyricsService.instance) LyricsService.instance = new LyricsService();
        return LyricsService.instance;
    }

    get(id: number): Promise<Lyric> {
        return this.readOnlyOperation<Lyric>((objectStore) => {
            return objectStore.get(id);
        });
    }

    getAll(): Promise<Lyric[]> {
        return this.readOnlyOperation<Lyric[]>((objectStore) => {
            return objectStore.getAll();
        });
    }

    count(): Promise<number> {
        return this.readOnlyOperation<number>((objectStore) => {
            return objectStore.count();
        });
    }

    async load(): Promise<void> {
        store.song = null;

        const count = await this.count();
        console.log(`Lyrics count: ${count}`);
        if (count > 0) return;
        
        await this.loadFromServer();
        return Promise.resolve();
    }

    async loadFromServer() {
        this.fetchLyrics().then(async (lyrics: Lyric[]) => {
            await this.saveAllLyrics(lyrics);
            return lyrics
        });
    }

    private async fetchLyrics(): Promise<Lyric[]> {
        return fetch('./lyrics.json').then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch lyrics');
            }
            return response.json();
        });
    }
    async save(lyric: Lyric): Promise<void> {
        const clone = deepToRaw(lyric);
        await this.saveOperation(clone);
    }
    
    private async saveAllLyrics(lyrics: Lyric[]): Promise<void> {
        return this.saveAllOperation(lyrics);
    }

    async truncate(): Promise<void> {
        return this.clear();
    }
}

export default LyricsService.getInstance()
