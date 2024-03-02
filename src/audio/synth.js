import { el } from "@elemaudio/core";

export class Synth {
  voices = [];

  playNote(midiNote, adsr, waveform) {
    const key = `v${midiNote}`;
    const freq = computeFrequency(midiNote);

    // Add note to voices after removing previous instances.
    this.voices = this.voices
      .filter((voice) => voice.key !== key)
      .concat({ gate: 1, freq, key })
      .slice(-8);

    return synth(this.voices, adsr, waveform);
  }

  stopNote(midiNote, adsr) {
    const key = `v${midiNote}`;
    this.voices = this.voices.filter((voice) => voice.key !== key);

    if (this.voices.length > 0) {
      return synth(this.voices, adsr);
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

function synthVoice(voice, adsr, waveform = "blepsaw") {
  // Each synth voice has a gate signal like this that simply
  // alternates between 0 and 1 according to our state, `voice`.
  let gate = el.const({
    key: `${voice.key}:gate`,
    value: voice.gate,
  });

  console.log(adsr);
  let { attack, decay, sustain, release } = adsr;

  return el.mul(
    0.5,
    el.const({ key: `${voice.key}:gate`, value: voice.gate }),
    el.adsr(attack, decay, sustain, release, gate),
    el[waveform](el.const({ key: `${voice.key}`, value: voice.freq }))
  );
}

function synth(voices, adsr, waveform) {
  return el.mul(
    el.add(...voices.map((voice) => synthVoice(voice, adsr, waveform))),
    0.5
  );
}

function silence() {
  return el.const({ key: "silence", value: 0 });
}
