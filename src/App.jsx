import Emittery from "emittery";
import styles from "./styles/App.module.scss";
import { Engine } from "./audio/engine";
import { Midi } from "./audio/midi";
import { Synth, computeFrequency } from "./audio/synth";
import { useEffect, useState } from "react";
import { keyDownShortcuts, keyUpShortcuts, shortcutKeys } from "./shortcuts";
import Key from "./Key";

const noteEmitter = new Emittery();
const engine = new Engine();
const midi = new Midi(noteEmitter);
const synth = new Synth();

export default function App() {
  let [started, setStarted] = useState(false);
  let [midiNote, setMidiNote] = useState(0);
  let [frequency, setFrequency] = useState(0);
  let [controllers, setControllers] = useState([]);

  useEffect(() => {
    // console.log({ midiNote });
  }, [midiNote]);

  async function getStarted(handleControllers) {
    await midi.initialize(handleControllers);
    await engine.initialize();
    setStarted(true);
    console.log("getting started");
  }

  function handleKeyDown(note) {
    engine.render(synth.playNote(note));
    setFrequency(computeFrequency(note));
    setMidiNote(note);
  }

  function handleKeyUp(note) {
    engine.render(synth.stopNote(note));
    setFrequency(0);
    setMidiNote(0);
  }

  useEffect(() => {
    // Handle MIDI events
    // Play note and update indicators
    noteEmitter.on("play", ({ midiNote }) => {
      handleKeyDown(midiNote);
    });

    // Stop note
    noteEmitter.on("stop", ({ midiNote }) => {
      handleKeyUp(midiNote);
    });

    // Stop all notes
    noteEmitter.on("stopAll", () => {
      engine.render(synth.stopAllNotes());
      setFrequency(0);
      setMidiNote(0);
    });

    // Handle shortcuts
    keyDownShortcuts(handleKeyDown);
    keyUpShortcuts(handleKeyUp);
  }, []);

  function handleControllers(controllers, selectedController) {
    setControllers(controllers);
  }

  function renderControllerButtons() {
    return controllers.map((controller) => (
      <button
        key={controller}
        className="controller"
        onClick={() => {
          midi.setController(controller);
        }}
      >
        {controller}
      </button>
    ));
  }

  return (
    <div id="app" className={styles.app}>
      {!started ? (
        <div id="start" className={styles.start}>
          <h3>Simple Synth using Elementary Audio</h3>
          <button
            onClick={() => {
              getStarted(handleControllers);
            }}
          >
            Start
          </button>
        </div>
      ) : (
        <div id="synth" className={styles.synth}>
          <div id="controllers">{controllers && renderControllerButtons()}</div>
          <div id="keyboard" className={styles.keyboard}>
            {shortcutKeys.map((key, index) => (
              <Key
                key={index}
                midiNote={key.midiNote}
                shortcutKey={key.key}
                handleKeyDown={handleKeyDown}
                handleKeyUp={handleKeyUp}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
