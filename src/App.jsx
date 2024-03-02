import Emittery from "emittery";
import styles from "./styles/App.module.scss";
import { Engine } from "./audio/engine";
import { Midi } from "./audio/midi";
import { Synth } from "./audio/synth";
import { useCallback, useEffect, useState } from "react";
import EnvelopeGraph from "react-envelope-graph";
import PianoRoll from "./PianoRoll";
import Knob from "./components/Knob/Knob";

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
  }, [handleKeyDown, handleKeyUp]);

  // useEffect(() => {
  //   keyDownShortcuts(handleKeyDown);
  //   keyUpShortcuts(handleKeyUp);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //     document.removeEventListener("keyup", handleKeyUp);
  //   };
  // }, []);

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
          <div id="oscillator" className={styles.oscillator}>
            <label htmlFor="waveform">Waveform</label>
            <select
              id="waveform"
              onChange={(e) => {
                setWaveform(e.target.value);
              }}
            >
              <option value="blepsaw">Saw</option>
              <option value="blepsquare">Square</option>
              <option value="bleptriangle">Triangle</option>
            </select>
          </div>
          <div id="adsr" className={styles.adsr}>
            <EnvelopeGraph
              defaultXa={adsr.attack}
              defaultYa={1}
              defaultXd={adsr.decay}
              defaultYs={adsr.sustain}
              defaultXr={adsr.release}
              onChange={(env) => {
                setAdsr({
                  attack: env.xa,
                  decay: env.xd,
                  sustain: env.ys,
                  release: env.xr,
                });
              }}
              styles={{
                line: {
                  fill: "none",
                  stroke: "red",
                  strokeWidth: 1,
                },
                dndBox: {
                  fill: "none",
                  stroke: "white",
                  strokeWidth: 0.2,
                  height: 1,
                  width: 1,
                },
                dndBoxActive: {
                  fill: "white",
                },
                corners: {
                  strokeWidth: 0,
                },
              }}
            />
            <div>
              <label htmlFor="attack">Attack</label>
              <Knob
                min={0.01}
                max={2}
                value={adsr.attack}
                onChange={(value) => setAdsr({ ...adsr, attack: value })}
              />
            </div>
            <div>
              <label htmlFor="decay">Decay</label>
              <input
                type="range"
                id="decay"
                min={0.01}
                max={2}
                step={0.01}
                defaultValue={adsr.decay}
                onChange={(e) =>
                  setAdsr({ ...adsr, decay: Number(e.target.value) })
                }
              />
              <label htmlFor="decay-value">{adsr.decay}</label>
            </div>
            <div>
              <label htmlFor="sustain">Sustain</label>
              <input
                type="range"
                id="sustain"
                min={0.01}
                max={1}
                step={0.01}
                defaultValue={adsr.sustain}
                onChange={(e) =>
                  setAdsr({ ...adsr, sustain: Number(e.target.value) })
                }
              />
              <label htmlFor="sustain-value">{adsr.sustain}</label>
            </div>
            <div>
              <label htmlFor="release">Release</label>
              <input
                type="range"
                id="release"
                min={0.01}
                max={2}
                step={0.01}
                defaultValue={adsr.release}
                onChange={(e) =>
                  setAdsr({ ...adsr, release: Number(e.target.value) })
                }
              />
              <label htmlFor="release-value">{adsr.release}</label>
            </div>
          </div>
          {/* USB MIDI */}
          <div id="controllers">{controllers && renderControllerButtons()}</div>
          <PianoRoll handleKeyDown={handleKeyDown} handleKeyUp={handleKeyUp} />
        </div>
      )}
    </div>
  );
}
