import EnvelopeGraph from "react-envelope-graph";
import Knob from "../Knob/Knob";
import styles from "./ADSR.module.scss";
import PropTypes from "prop-types";
import { round } from "../../utils";

export default function ADSR({ adsr, setAdsr }) {
  return (
    <div id="adsr" className={styles.adsr}>
      <div>
        <Knob
          min={0.01}
          max={1}
          title="Attack"
          value={adsr.attack}
          onChange={(value) => setAdsr({ ...adsr, attack: round(value) })}
        />
      </div>
      <div>
        <Knob
          min={0.01}
          max={1}
          title="Decay"
          value={adsr.decay}
          onChange={(value) => setAdsr({ ...adsr, decay: round(value) })}
        />
      </div>
      <div>
        <Knob
          min={0.01}
          max={1}
          title="Sustain"
          value={adsr.sustain}
          onChange={(value) => setAdsr({ ...adsr, sustain: round(value) })}
        />
      </div>
      <div>
        <Knob
          min={0.01}
          max={1}
          title="Release"
          value={adsr.release}
          onChange={(value) => setAdsr({ ...adsr, release: round(value) })}
        />
      </div>
      <div className={styles.graph}>
        <EnvelopeGraph
          defaultXa={adsr.attack}
          defaultXd={adsr.decay}
          defaultYs={adsr.sustain}
          defaultXr={adsr.release}
          onChange={(env) => {
            setAdsr({
              attack: round(env.xa),
              decay: round(env.xd),
              sustain: round(env.ys),
              release: round(env.xr),
            });
          }}
          styles={{
            line: {
              fill: "none",
              stroke: "white",
              strokeWidth: 1,
            },
            dndBox: {
              stroke: "white",
              strokeWidth: 0.5,
              height: 2,
              width: 2,
            },
            dndBoxActive: {
              fill: "white",
            },
            corners: {
              strokeWidth: 0,
            },
          }}
          style={{
            width: "100%",
            height: "100%",
            minHeight: 80,
            backgroundColor: "black",
          }}
        />
      </div>
    </div>
  );
}

ADSR.propTypes = {
  adsr: PropTypes.object.isRequired,
  setAdsr: PropTypes.func.isRequired,
};
