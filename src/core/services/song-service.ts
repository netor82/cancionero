import type { Song } from '../interfaces/song'
import { store } from '../store';

const STORAGE_KEY = 'cancionero_songs'

class SongService {
  items: Song[] = []
  private static instance: SongService;

  private constructor() { }

  static getInstance(): SongService {
    if (!SongService.instance) SongService.instance = new SongService();
    return SongService.instance;
  }

  async load(): Promise<Song[]> {
    if (this.items.length) return this.items;

    try {
      const storedSongs = localStorage.getItem(STORAGE_KEY)
      if (storedSongs) {
        this.items = JSON.parse(storedSongs) as Song[]
      }
      else {
        await this.loadFromServer();
      }
    } catch (error) {
      console.error('Error loading songs from localStorage:', error)
    }
    return this.items
  }

  async loadFromServer() {
    const songs = await this.fetchSongs();
    this.items = songs;
    this.save(songs);
    store.setSongs(songs);
  }

  unload(): void {
    this.items = []
    store.setSongs([])
    localStorage.removeItem(STORAGE_KEY)
  }

  add(song: Song): Song[] {
    this.items.push(song)
    return this.items
  }

  update(updatedSong: Song): Song[] {
    const index = this.items.findIndex(song => song.id === updatedSong.id)
    if (index !== -1) {
      this.items[index] = updatedSong
    }
    return this.items
  }

  delete(id: number): Song[] {
    this.items = this.items.filter(song => song.id !== id)
    return this.items
  }

  private async fetchSongs(): Promise<Song[]> {
    const response = await fetch('./songs.json');
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    return response.json();
  }

  private save(items: Song[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving songs to localStorage:', error)
    }
  }
}

export default SongService.getInstance()