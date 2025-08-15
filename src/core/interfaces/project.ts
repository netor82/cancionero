export interface Project {
    id: number
    date: Date
    title: string
    songs: ProjectSong[]
}

export interface ProjectSong {
    id: number
    transpose: number
}

export interface ProjectDTO {
    d: number
    t: string
    s: ProjectSongDTO[]
}

export interface ProjectSongDTO {
    s: number
    t: number
}
