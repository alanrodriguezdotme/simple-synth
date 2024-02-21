export const shortcutKeys = [
  { key: "q", midiNote: 48 },
  { key: "2", midiNote: 49 },
  { key: "w", midiNote: 50 },
  { key: "3", midiNote: 51 },
  { key: "e", midiNote: 52 },
  { key: "r", midiNote: 53 },
  { key: "5", midiNote: 54 },
  { key: "t", midiNote: 55 },
  { key: "6", midiNote: 56 },
  { key: "y", midiNote: 57 },
  { key: "7", midiNote: 58 },
  { key: "u", midiNote: 59 },
  { key: "c", midiNote: 60 },
  { key: "f", midiNote: 61 },
  { key: "v", midiNote: 62 },
  { key: "g", midiNote: 63 },
  { key: "b", midiNote: 64 },
  { key: "n", midiNote: 65 },
  { key: "j", midiNote: 66 },
  { key: "m", midiNote: 67 },
  { key: "k", midiNote: 68 },
  { key: ",", midiNote: 69 },
  { key: "l", midiNote: 70 },
  { key: ".", midiNote: 71 },
  { key: "/", midiNote: 72 }
];


export function keyDownShortcuts(handleKeyDown, adsr) {
  return document.addEventListener("keydown", (event) => {
    const key = event.key;
    let midiNote;

    switch (key) {
      // first octave
      case "q": midiNote = 48; break;
      case "2": midiNote = 49; break;
      case "w": midiNote = 50; break;
      case "3": midiNote = 51; break;
      case "e": midiNote = 52; break;
      case "r": midiNote = 53; break;
      case "5": midiNote = 54; break;
      case "t": midiNote = 55; break;
      case "6": midiNote = 56; break;
      case "y": midiNote = 57; break;
      case "7": midiNote = 58; break;
      case "u": midiNote = 59; break;

      // second octave
      case "c": midiNote = 60; break;
      case "f": midiNote = 61; break;
      case "v": midiNote = 62; break;
      case "g": midiNote = 63; break;
      case "b": midiNote = 64; break;
      case "n": midiNote = 65; break;
      case "j": midiNote = 66; break;
      case "m": midiNote = 67; break;
      case "k": midiNote = 68; break;
      case ",": midiNote = 69; break;
      case "l": midiNote = 70; break;
      case ".": midiNote = 71; break;
      case "/": midiNote = 72; break;
    }

    if (midiNote !== undefined) {
      handleKeyDown(midiNote, adsr);
    }
  });
}

export function keyUpShortcuts(handleKeyUp, adsr) {
  return document.addEventListener("keyup", (event) => {
    const key = event.key;
    let midiNote;

    switch (key) {
      // first octave
      case "q": midiNote = 48; break;
      case "2": midiNote = 49; break;
      case "w": midiNote = 50; break;
      case "3": midiNote = 51; break;
      case "e": midiNote = 52; break;
      case "r": midiNote = 53; break;
      case "5": midiNote = 54; break;
      case "t": midiNote = 55; break;
      case "6": midiNote = 56; break;
      case "y": midiNote = 57; break;
      case "7": midiNote = 58; break;
      case "u": midiNote = 59; break;

      // second octave
      case "c": midiNote = 60; break;
      case "f": midiNote = 61; break;
      case "v": midiNote = 62; break;
      case "g": midiNote = 63; break;
      case "b": midiNote = 64; break;
      case "n": midiNote = 65; break;
      case "j": midiNote = 66; break;
      case "m": midiNote = 67; break;
      case "k": midiNote = 68; break;
      case ",": midiNote = 69; break;
      case "l": midiNote = 70; break;
      case ".": midiNote = 71; break;
      case "/": midiNote = 72; break;
    }

    if (midiNote !== undefined) {
      handleKeyUp(midiNote, adsr)
    }
  });
}
