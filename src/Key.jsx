import { useState } from "react";
import styles from "./styles/Key.module.scss";

const sharpNotes = [49, 51, 54, 56, 58, 61, 63, 66, 68, 70];

export default function Key({
  midiNote,
  shortcutKey,
  handleKeyDown,
  handleKeyUp,
  adsr,
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const isSharp = sharpNotes.includes(midiNote);

  function getLeftPosition(note) {
    const whiteKeyWidth = 64;
    let offset = 12;

    if (note >= 54 && note <= 58) {
      offset += whiteKeyWidth / 2;
    }

    if (note >= 61 && note <= 63) {
      offset += whiteKeyWidth;
    }

    if (note >= 66 && note <= 70) {
      offset += whiteKeyWidth * 1.5;
    }

    return (note - 48) * (whiteKeyWidth / 2) + offset;
  }

  return (
    <div
      className={styles.key + (isSharp ? ` ${styles.sharp}` : "")}
      onMouseDown={() => handleKeyDown(midiNote, adsr)}
      onMouseUp={() => handleKeyUp(midiNote, adsr)}
      onMouseLeave={() => handleKeyUp(midiNote, adsr)}
      style={isSharp ? { left: getLeftPosition(midiNote, adsr) } : {}}
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
  adsr: PropTypes.object.isRequired,
};
