import type { Notes } from "../enums/notes"

export interface Lyric {
    id: number
    notes: Note[][]
    text: string[]
}

export interface Note {
    note: Notes
    chord?: string
    position: number
}