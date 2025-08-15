import { store } from '../store';
import type { Lyric } from '../interfaces/lyrics';
import _const from '../enums/const';
import BaseDbService, { StoreName } from './basedb-service';
import { deepToRaw } from '../utils/deepToRaw';



export default class LyricsService extends BaseDbService {
    private static instance : LyricsService;

    constructor() {
        super(StoreName.LYRICS, 'id');
        if (LyricsService.instance) return LyricsService.instance;
        LyricsService.instance = this;
    }

    initDB(): Promise<void> {
        return super.initDB();
    }

    get(id: number): Promise<Lyric> {
        return this.readOnlyOperation<Lyric>((objectStore) => {
            return objectStore.get(id);
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
        
        const lyrics = await this.fetchLyrics();
        await this.saveAllLyrics(lyrics);
        return Promise.resolve();
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
    
    private saveAllLyrics(lyrics: Lyric[]): Promise<void> {
        return this.saveAllOperation(lyrics);
    }

    async truncate(): Promise<void> {
        return this.clear();
    }
}
