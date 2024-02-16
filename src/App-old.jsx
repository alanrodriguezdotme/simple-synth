import "./App.css";
import WebRenderer from "@elemaudio/web-renderer";
import { el } from "@elemaudio/core";
import { useEffect } from "react";
import Layout from "./Layout";

const ctx = new AudioContext();
const core = new WebRenderer();

let voices = [
  { gate: 0.0, freq: 440, key: "v1" },
  { gate: 0.0, freq: 440, key: "v2" },
  { gate: 0.0, freq: 440, key: "v3" },
  { gate: 0.0, freq: 440, key: "v4" },
];

let nextVoice = 0;

function updateVoiceState(e) {
  if (e.type && e.type === "noteOn") {
    voices[nextVoice].gate = 1.0;
    voices[nextVoice].freq = e.noteFrequency;

    if (++nextVoice >= voices.length) {
      nextVoice -= voices.length;
    }
  }

  if (e.type && e.type === "noteOff") {
    for (let i = 0; i < voices.length; i++) {
      if (voices[i].freq === e.noteFrequency) {
        voices[i].gate = 0.0;
      }
    }
  }
}

function synthVoice(voice) {
  return el.mul(
    el.const({ key: `${voice.key}:gate`, value: 0.2 * voice.gate }),
    el.cycle(el.const({ key: `${voice.key}:gate`, value: voice.freq }))
  );
}

async function initialize() {
  let node = await core.initialize(ctx, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });

  node.connect(ctx.destination);
}

export default function App() {
  useEffect(() => {
    initialize();
  }, []);

  core.on("load", () => {
    core.on("midi", (e) => {
      updateVoiceState(e);

      let out = el.add(voices.map(synthVoice));
      core.render(out);
    });
  });

  return <Layout />;
}
