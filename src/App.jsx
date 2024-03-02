import Emittery from "emittery";
import styles from "./App.module.scss";
import common from "./Common.module.scss";
import { Engine } from "./audio/engine";
import { Midi } from "./audio/midi";
import { Synth } from "./audio/synth";
import { useCallback, useEffect, useState } from "react";
import PianoRoll from "./components/PianoRoll/PianoRoll";
import ADSR from "./components/Adsr/Adsr";

const noteEmitter = new Emittery();
const engine = new Engine();
const midi = new Midi(noteEmitter);
const synth = new Synth();

export default function App() {
  let [started, setStarted] = useState(false);
  let [controllers, setControllers] = useState([]);
  let [adsr, setAdsr] = useState({
    attack: 0.8,
    decay: 1,
    sustain: 0.75,
    release: 0.4,
  });
  let [waveform, setWaveform] = useState("blepsaw");

  async function getStarted(handleControllers) {
    await midi.initialize(handleControllers);
    await engine.initialize();
    setStarted(true);
    console.log("getting started");
  }

  const handleKeyDown = useCallback(
    (note) => {
      engine.render(synth.playNote(note, adsr, waveform));
    },
    [adsr, waveform]
  );

  const handleKeyUp = useCallback(
    (note) => {
      engine.render(synth.stopNote(note, adsr));
    },
    [adsr]
  );

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
    });
  }, []);

  // TODO: Add UI for USB MIDI support
  function handleControllers(controllers, selectedController) {
    setControllers(controllers);
  }

  function renderControllerButtons() {
    return controllers.map((controller) => (
      <option key={controller} value={controller}>
        {controller}
      </option>
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
          <div className={styles.controls}>
            <div id="waveform" className={styles.waveform}>
              <div className={styles.titleSelectContainer}>
                <label className={common.title} htmlFor="waveform">
                  Waveform
                </label>
                <div className={styles.selectContainer}>
                  <select
                    id="waveformSelect"
                    onChange={(e) => {
                      setWaveform(e.target.value);
                    }}
                  >
                    <option value="blepsaw">Saw</option>
                    <option value="blepsquare">Square</option>
                    <option value="bleptriangle">Triangle</option>
                  </select>
                </div>
              </div>
            </div>
            <ADSR adsr={adsr} setAdsr={setAdsr} />
            {/* USB MIDI */}
            <div id="midi" className={styles.midi}>
              <div className={styles.selectContainer}>
                <div className={styles.titleSelectContainer}>
                  <label className={common.title} htmlFor="waveform">
                    MIDI Controller
                  </label>
                  <select
                    className={styles.select}
                    id="midiSelect"
                    onChange={(e) => midi.setController(e.target.value)}
                  >
                    {controllers.length > 0 ? (
                      renderControllerButtons()
                    ) : (
                      <option value="">No MIDI foundfffff</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <PianoRoll handleKeyDown={handleKeyDown} handleKeyUp={handleKeyUp} />
        </div>
      )}
    </div>
  );
}
