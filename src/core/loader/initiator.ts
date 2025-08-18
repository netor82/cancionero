import songService from "../services/song-service"
import tagService from "../services/tag-service";
import lyricsService from "../services/lyrics-service";
import { store as gStore } from "../store"

export const initiator = {
    async init(): Promise<void> {
        await Promise.all([loadTags(), loadSongs(), loadLyrics()]);
        return Promise.resolve();
    }
}

async function loadSongs() {
    await songService.load()
    gStore.setSongs(songService.items)
}

async function loadTags() {
    await tagService.load()
}

async function loadLyrics() {
    await lyricsService.load()
}
