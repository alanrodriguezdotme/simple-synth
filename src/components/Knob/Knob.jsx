import { useEffect, useRef, useState } from "react";
import styles from "./Knob.module.scss";
import common from "../../Common.module.scss";
import PropTypes from "prop-types";
import { useEventListener, round } from "../../utils";

export default function Knob({ min = 4, max = 20, value, title, onChange }) {
  const [rotation, setRotation] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [displayValue, setDisplayValue] = useState(value * 100);
  const knobRef = useRef(null);
  const maxRotation = 135;

  function calculateValue(degrees) {
    const valueRange = max - min;
    const degreesRange = maxRotation * 2;
    const valuePerDegree = valueRange / degreesRange;
    const value = min + valuePerDegree * (degrees + maxRotation);
    return Math.round(Math.max(min, Math.min(max, value)) * 100) / 100;
  }

  function calculateDegrees(value) {
    const valueRange = max - min;
    const degreesRange = maxRotation * 2;
    const degreesPerValue = degreesRange / valueRange;
    const degrees = (value - min) * degreesPerValue - maxRotation;
    return Math.round(degrees * 100) / 100;
  }

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setStartCoords({ x: e.pageX, y: e.pageY });
  };

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      const { y } = startCoords;
      const { clientY } = e;
      const adjustedDiff = (clientY - y) / 50;
      const degrees = (-adjustedDiff * 180) / Math.PI;
      const limitedDegrees = Math.max(
        -maxRotation,
        Math.min(maxRotation, degrees)
      );
      setRotation(limitedDegrees);
      onChange(calculateValue(limitedDegrees));
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  useEventListener("pointerdown", handleMouseDown, knobRef.current);
  useEventListener("pointermove", handleMouseMove);
  useEventListener("pointerup", handleMouseUp);

  useEffect(() => {
    setRotation(calculateDegrees(value));
    setDisplayValue(round(value * 100));
  }, [value]);

  return (
    <div className={styles.knobContainer} ref={knobRef}>
      <label className={common.title} htmlFor="knob-title">
        {title}
      </label>
      <div className={styles.knob}>
        <div
          className={styles.knobInner}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className={styles.dot} />
        </div>
        <label className={styles.value} htmlFor="knob-value">
          {displayValue}
        </label>
      </div>
    </div>
  );
}

Knob.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
