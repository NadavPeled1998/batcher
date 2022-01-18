import React from "react";
import { useToggle, useVibrate } from "react-use";

const Demo = () => {
  const [vibrating, toggleVibrating] = useToggle(false);
  useVibrate(vibrating, [100], false);

  return (
    <div>
      <button onClick={toggleVibrating}>
        {vibrating ? "Stop" : "Vibrate"}
      </button>
    </div>
  );
};
export default Demo;
