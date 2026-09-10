# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Vite)
- `npm run build` — type-check (`vue-tsc --build`) then production build
- `npm run type-check` — run `vue-tsc --build` alone
- `npm run preview` — preview the production build

There is no test suite and no lint script configured.

## Architecture

Vue 3 + TypeScript + Vite SPA for managing song lyrics/chords ("cancionero" = songbook). No backend/API — all app data ships as static JSON in `public/` (`songs.json`, `lyrics.json`, `tags.json`, `version.txt`) and is cached client-side.

### Data flow and storage
- **Songs and Tags**: fetched from `public/*.json`, cached in `localStorage` (see `src/core/services/song-service.ts`, `tag-service.ts`).
- **Lyrics**: fetched from `public/lyrics.json`, cached in **IndexedDB** (larger, per-song text/chord data) via `src/core/services/basedb-service.ts` (`BaseDbService`), extended by `lyrics-service.ts` and `project-service.ts`. IndexedDB schema/version lives in `src/core/enums/const.ts`.
- **Versioning**: `src/core/services/version-service.ts` compares a local version triplet `[Lyrics, Songs, Tags]` (stored in `localStorage`) against `public/version.txt` to decide which of the three datasets need re-fetching from the server. Bump `version.txt` whenever the corresponding `public/*.json` changes.
- **Bootstrapping**: `src/core/loader/initiator.ts` loads tags, songs, and lyrics in parallel on app start and populates the global store.
- **Global state**: `src/core/store.ts` is a single `reactive()` object (current song, song list, current project, transpose amount, note convention, tags, active UI section). No Vuex/Pinia — components read/mutate this store directly.

### Domain model
- A **Song** has metadata + tags; its chord/lyric content is a separate **Lyric** record (`src/core/interfaces/lyrics.ts`) keyed by song id, storing text lines plus chord `notes` (note number, chord name, character position) per line — see `Chord.vue`/`Lyrics.vue` for rendering and `Editor.vue` for editing.
- Chord transposition and note-naming convention (e.g. Latin do/re/mi vs. English notation) are handled via `src/core/enums/notes.ts` and `store.transpose` / `store.noteConvention`.
- A **Project** (`src/core/interfaces/project.ts`) is an ordered setlist of songs, persisted through `ProjectService` (IndexedDB-backed like lyrics). `Project.vue`/`ProjectSong.vue`/`SongControl.vue` drive project playback/navigation.
- **Sections** (`src/core/enums/sections.ts`) control top-level UI navigation (Projects / Songs / Lyrics), tracked as `store.section.active`/`last`.

### Utility script
`utils/go.js` is a standalone Node script (not part of the Vite app) that converts a plain-text chord/lyric input file (`utils/input.txt`) into the Lyric JSON shape (`utils/output.json`) — used for authoring new song data offline, not invoked at runtime.
