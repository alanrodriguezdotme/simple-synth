import { el } from "@elemaudio/core";

export class Synth {
  voices = [];

  playNote(midiNote) {
    const key = `v${midiNote}`;
    const freq = computeFrequency(midiNote);

    // Add note to voices after removing previous instances.
    this.voices = this.voices
      .filter((voice) => voice.key !== key)
      .concat({ gate: 1, freq, key })
      .slice(-8);

    return synth(this.voices);
  }

  stopNote(midiNote) {
    const key = `v${midiNote}`;
    this.voices = this.voices.filter((voice) => voice.key !== key);

    if (this.voices.length > 0) {
      return synth(this.voices);
    } else {
      return silence();
    }
  }

  stopAllNotes() {
    this.voices = [];

    return silence();
  }
}

export function computeFrequency(midiNote) {
  return 440 * 2 ** ((midiNote - 69) / 12);
}

function synthVoice(voice) {
  return el.mul(
    el.const({ key: `${voice.key}:gate`, value: voice.gate }),
    el.blepsaw(el.const({ key: `${voice.key}`, value: voice.freq }))
  );
}

function synth(voices) {
  return el.mul(el.add(...voices.map((voice) => synthVoice(voice))), 0.1);
}

function silence() {
  return el.const({ key: "silence", value: 0 });
}
