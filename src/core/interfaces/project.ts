export interface Project {
    id: number
    date: Date
    title: string
    songs: ProjectSong[]
    shareId?: string | null
}

export interface ProjectSong {
    id: number
    transpose: number
    label?: string
}

// DTOs to save to file
export interface ProjectDTO {
    d: number
    t: string
    s: ProjectSongDTO[]
}

export interface ProjectSongDTO {
    s: number
    t: number
    l?: string
}
