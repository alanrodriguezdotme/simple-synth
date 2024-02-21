import Emittery from "emittery";
import styles from "./styles/App.module.scss";
import { Engine } from "./audio/engine";
import { Midi } from "./audio/midi";
import { Synth } from "./audio/synth";
import { useEffect, useState } from "react";
import { keyDownShortcuts, keyUpShortcuts, shortcutKeys } from "./shortcuts";
import Key from "./Key";
import EnvelopeGraph from "react-envelope-graph";

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

  async function getStarted(handleControllers) {
    await midi.initialize(handleControllers);
    await engine.initialize();
    setStarted(true);
    console.log("getting started");
  }

  function handleKeyDown(note, env) {
    engine.render(synth.playNote(note, env));
  }

  function handleKeyUp(note, env) {
    engine.render(synth.stopNote(note, env));
  }

  useEffect(() => {
    // Handle MIDI events
    // Play note and update indicators
    noteEmitter.on("play", ({ midiNote }) => {
      handleKeyDown(midiNote, adsr);
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

  useEffect(() => {
    // Handle shortcuts
    // keyDownShortcuts((note) => handleKeyDown(note, adsr));
    // keyUpShortcuts((note) => handleKeyUp(note, adsr));

    keyDownShortcuts(handleKeyDown, adsr);
    keyUpShortcuts(handleKeyUp, adsr);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
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
          <div id="adsr" className={styles.adsr}>
            <EnvelopeGraph
              defaultXa={adsr.attack}
              defaultYa={1}
              defaultXd={adsr.decay}
              defaultYs={adsr.sustain}
              defaultXr={adsr.release}
              // ratio={{
              //   xa: 0.25,
              //   xd: 0.25,
              //   xs: 0.25,
              //   xr: 0.25,
              // }}
              onChange={(env) => {
                console.log(env);
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
              <input
                type="range"
                id="attack"
                min={0.01}
                max={1}
                step={0.01}
                defaultValue={adsr.attack}
                onChange={(e) =>
                  setAdsr({ ...adsr, attack: Number(e.target.value) })
                }
              />
              <label htmlFor="attack-value">{adsr.attack}</label>
            </div>
            <div>
              <label htmlFor="decay">Decay</label>
              <input
                type="range"
                id="decay"
                min={0.01}
                max={1}
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
                max={1}
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
          <div id="keyboard" className={styles.keyboard}>
            {shortcutKeys.map((key, index) => (
              <Key
                key={index}
                midiNote={key.midiNote}
                shortcutKey={key.key}
                handleKeyDown={handleKeyDown}
                handleKeyUp={handleKeyUp}
                adsr={adsr}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
