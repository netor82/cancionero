import { reactive } from 'vue'
import type { Song } from '@/core/interfaces/song'
import type { Tag } from './interfaces/tag'
import { Sections } from './enums/sections'
import type { Project } from './interfaces/project'

export const store = reactive({
    song: null as Song | null,
    songs: [] as Song[],
    project: null as Project | null,
    projectHas(songId: number) : boolean {
        return this.project?.songs.some(song => song.id === songId) ?? false
    },
    setSongs(songs: Song[]) {
        this.songs = songs
    },
    transpose: 0,
    noteConvention: 1,
    changeNoteConvention() {
        this.noteConvention = (this.noteConvention+1)%3
    },
    tags: [] as Tag[],
    section: {
        active: Sections.Songs,
        last: Sections.Songs,
        setActive(newSection: Sections) {
            this.active = newSection
            if (newSection !== Sections.Lyrics) {
                this.last = newSection
            }
        },
    }
})
