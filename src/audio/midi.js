import { WebMidi } from "webmidi";

export class Midi {
  noteEmitter;
  selectedInput;

  constructor(noteEmitter) {
    this.noteEmitter = noteEmitter;
    this.selectedInput = null;
  }

  async initialize(displayControllers) {
    try {
      await WebMidi.enable();
      displayControllers(this.#getInputNames(), this.selectedInput?.name);

      WebMidi.addListener("connected", () => {
        displayControllers(this.#getInputNames(), this.selectedInput?.name);
      });

      WebMidi.addListener("disconnected", () => {
        displayControllers(this.#getInputNames(), this.selectedInput?.name);
      });
    } catch (err) {
      console.error("WebMidi could not be initialized:", err);
    }
  }

  setController(controller) {
    // Stop any active notes
    this.noteEmitter.emit("stopAll");

    // Remove listeners from the previous input
    if (this.selectedInput) {
      this.selectedInput.removeListener("noteon");
      this.selectedInput.removeListener("noteoff");
    }

    // Set the new input
    this.selectedInput = WebMidi.getInputByName(controller);

    // Add note on
    this.selectedInput.addListener("noteon", (e) => {
      const midiNote = e.note.number;
      this.noteEmitter.emit("play", { midiNote });
    });

    // Add note off listener
    this.selectedInput.addListener("noteoff", (e) => {
      const midiNote = e.note.number;
      this.noteEmitter.emit("stop", { midiNote });
    });
  }

  #getInputNames() {
    return WebMidi.inputs.map((input) => input.name);
  }
}
