enum Notes {
    C = 0,
    Csharp = 1, // Db,
    D = 2,
    Dsharp = 3, // Eb,
    E = 4,
    F = 5,
    Fsharp = 6, // Gb,
    G = 7,
    Gsharp = 8, // Ab,
    A = 9,
    Asharp = 10, // Bb,
    B = 11
}

const notesName: Record<Notes, string> = {
    [Notes.C]: 'C',
    [Notes.Csharp]: 'C#',
    [Notes.D]: 'D',
    [Notes.Dsharp]: 'D#',
    [Notes.E]: 'E',
    [Notes.F]: 'F',
    [Notes.Fsharp]: 'F#',
    [Notes.G]: 'G',
    [Notes.Gsharp]: 'G#',
    [Notes.A]: 'A',
    [Notes.Asharp]: 'A#',
    [Notes.B]: 'B'
}

const notesNameL: Record<Notes, string> = {
    [Notes.C]: 'Do',
    [Notes.Csharp]: 'Do#',
    [Notes.D]: 'Re',
    [Notes.Dsharp]: 'Re#',
    [Notes.E]: 'Mi',
    [Notes.F]: 'Fa',
    [Notes.Fsharp]: 'Fa#',
    [Notes.G]: 'Sol',
    [Notes.Gsharp]: 'Sol#',
    [Notes.A]: 'La',
    [Notes.Asharp]: 'La#',
    [Notes.B]: 'Si'
}

export { Notes, notesName, notesNameL };
