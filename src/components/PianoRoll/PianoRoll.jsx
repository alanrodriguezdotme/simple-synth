import PropTypes from "prop-types";
import Key from "../Key/Key";
import { shortcutKeys } from "../../utils/shortcuts";
import styles from "./PianoRoll.module.scss";

export default function PianoRoll({ handleKeyDown, handleKeyUp }) {
  return (
    <div id="pianoRoll" className={styles.pianoRoll}>
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
  );
}

PianoRoll.propTypes = {
  handleKeyDown: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
};
