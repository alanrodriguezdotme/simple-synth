import { useState } from "react";
import styles from "./styles/Key.module.scss";

const sharpNotes = [49, 51, 54, 56, 58, 61, 63, 66, 68, 70];

export default function Key({
  midiNote,
  shortcutKey,
  handleKeyDown,
  handleKeyUp,
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const isSharp = sharpNotes.includes(midiNote);

  function getLeftPosition(note) {
    let offset = 15;

    if (note >= 54 && note <= 58) {
      offset += 40.5;
    }

    if (note >= 61 && note <= 63) {
      offset += 81;
    }

    if (note >= 66 && note <= 70) {
      offset += 121.5;
    }

    return (note - 48) * 40.5 + offset;
  }

  return (
    <div
      className={styles.key + (isSharp ? ` ${styles.sharp}` : "")}
      onMouseDown={() => handleKeyDown(midiNote)}
      onMouseUp={() => handleKeyUp(midiNote)}
      onMouseLeave={() => handleKeyUp(midiNote)}
      style={isSharp ? { left: getLeftPosition(midiNote) } : {}}
    >
      <div className={styles.keyText}>{shortcutKey}</div>
    </div>
  );
}

import PropTypes from "prop-types";

Key.propTypes = {
  midiNote: PropTypes.number.isRequired,
  shortcutKey: PropTypes.string.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
};
