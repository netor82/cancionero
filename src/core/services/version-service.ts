import songService from "./song-service"
import tagService from "./tag-service"
import lyricsService from "./lyrics-service"

const STORAGE_KEY = 'cancionero_version'

enum Parts {
    Lyrics,
    Songs,
    Tags
}

class VersionService {
    private static instance: VersionService
    private versions: number[] = [0, 0, 0]

    private constructor() { }

    static getInstance() {
        if (!VersionService.instance) VersionService.instance = new VersionService()
        return VersionService.instance
    }

    async update(): Promise<string> {
        return this.fetch().then((fetchedVersions) => {
            if (fetchedVersions) {
                let current = this.getLocal()
                let promises: Promise<void>[] = []

                if (fetchedVersions[Parts.Songs] > current[Parts.Songs]) {
                    promises.push(songService.loadFromServer().then(() => {
                        this.versions[Parts.Songs] = fetchedVersions[Parts.Songs]
                    }))
                }

                if (fetchedVersions[Parts.Tags] > current[Parts.Tags]) {
                    promises.push(tagService.loadFromServer().then(() => {
                        this.versions[Parts.Tags] = fetchedVersions[Parts.Tags]
                    }))
                }

                if (fetchedVersions[Parts.Lyrics] > current[Parts.Lyrics]) {
                    promises.push(lyricsService.loadFromServer().then(() => {
                        this.versions[Parts.Lyrics] = fetchedVersions[Parts.Lyrics]
                    }))
                }

                return Promise.all(promises).then(() => {
                    this.save();
                    return this.versions.join('.')
                })
            }
            return '0.0.0'
        }).catch((e) => {
            console.error(e)
            return '0.0.0'
        });
    }

    private save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.versions))
    }

    public get(): string {
        this.getLocal()
        return this.versions.join('.')
    }

    private getLocal(): number[] {
        const versions = localStorage.getItem(STORAGE_KEY)
        return versions ? JSON.parse(versions) : [0, 0, 0]
    }

    private async fetch(): Promise<number[]> {
        const response = await fetch('./version.txt')
        if (!response.ok) {
            throw new Error('Failed to fetch tags')
        }
        return response.json()
    }
}

export default VersionService.getInstance()
