import SongService from "../services/song-service"
import TagService from "../services/tag-service";
import LyricsService from "../services/lyrics-service";
import { store } from "../store"

export const initiator = {
    async init(): Promise<void> {
        await Promise.all([loadTags(), loadSongs(), loadLyrics()]);
        return Promise.resolve();
    }
}

async function loadSongs() {
    const songService = new SongService()
    await songService.load()
    store.setSongs(songService.items)
}

async function loadTags() {
    const tagService = new TagService()
    await tagService.load()
}

async function loadLyrics() {
    const lyricsService = new LyricsService();
    await lyricsService.initDB().then(() => {
        lyricsService.load()
    })
}
