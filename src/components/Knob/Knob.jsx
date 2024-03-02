import { useCallback, useState } from "react";
import styles from "./Knob.module.scss";
import PropTypes from "prop-types";
import useEventListener from "../../utils/useEventListener";

export default function Knob({ min, max, value, onChange }) {
  const [rotation, setRotation] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    setIsMouseDown(true);
    setStartCoords({ x: e.pageX, y: e.pageY });
  }, []);

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      const { x } = startCoords;
      const { clientX } = e;
      const adjustedDiff = (clientX - x) / 50;
      const degrees = (adjustedDiff * 180) / Math.PI;
      const limitedDegrees = Math.max(-135, Math.min(135, degrees));
      setRotation(limitedDegrees);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  useEventListener("mousedown", handleMouseDown);
  useEventListener("mousemove", handleMouseMove);
  useEventListener("mouseup", handleMouseUp);

  return (
    <div
      className={styles.knobContainer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div
        className={styles.knob}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className={styles.dot} />
      </div>
      <label htmlFor="knob-value">{value}</label>
    </div>
  );
}

Knob.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
