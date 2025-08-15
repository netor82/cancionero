
// read file
import fs from 'fs'
import os from 'os'

// read file as string lines
const readFileAsLines = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8')
    return content.split(os.EOL)
}

const fromNameToNote = (name, index) => {
    name = name.trim().toLowerCase();
    let note = 0

    if (name.startsWith('sol'))
    {
        note = 7
        name = name.substring(3).trim()
    }
    else
    {
        switch(name.substring(0,2)) {
            case 'do':
                note = 0
                break
            case 're':
                note = 2
                break
            case 'mi':
                note = 4
                break
            case 'fa':
                note = 5
                break
            case 'la':
                note = 9
                break
            case 'si':
                note = 11
                break
        }
        name = name.substring(2)
    }


    if (name.startsWith('#')) {
        note++
        name = name.substring(1).trim()
    }
    return {
        note,
        chord: name,
        position: index*5
    };
}

const processNotes = (line) => {
    const notes = []

    // split line by any whitespace and return array of notes
    const parts = line.split(/\s+/)
    for (let i = 0; i < parts.length; i++) {
        const note = fromNameToNote(parts[i], i)
        notes.push(note)
    }

    return notes
}

let lines = [], notes = []

const text = readFileAsLines('./input.txt');
for (let i = 0; i < text.length; i++) {
    if (!text[i].trim()) {
        lines.push('')
        notes.push([])
        continue
    }

    lines.push(text[i+1])
    notes.push(processNotes(text[i]))
    i++
}


// write to file
fs.writeFileSync('./output.json', JSON.stringify({ id:0, text:lines, notes }, null, 2));
