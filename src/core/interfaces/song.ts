export interface Song {
    id: number
    title: string
    author: string
    source: number
    comments: string
    tags: number[]
}

export interface SearchableSong extends Song {
    search: string
}