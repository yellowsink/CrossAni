import useCrossani from "@crossani/react/index";
import {EASE, Transition} from "crossani";
import {useState} from "react";

const transitions = {
  default: {
    reset: true,
    ms: 500,
  },

  step1: {
    state: {
      "background-color": "blue",
      border: "2px dashed red",
    },
    ms: 250,
    easing: EASE.linear,
  },

  step2: {
    state: {
      width: "250px",
      height: "90px",
    },
    ms: 300,
    easing: EASE.in,
  },

  step3: {
    state: {
      transform: "rotate(170deg)",
      "margin-left": "15rem",
    },
    ms: 600,
    easing: EASE.out,
  },
};

const step4 = {
  state: {
    background: "radial-gradient(circle at 110px, red, green)",
    "border-radius": "50%",
    "box-shadow": "0 0 10px black",
    transform: "rotate(170deg) translateX(50px) skewY(40deg)",
  },
  ms: 150,
  easing: EASE.startSteps(2),
};

export default () => {
  const [ref, setTrigger] = useCrossani(transitions);

  function triggerAnimation() {
    setTrigger("step1");
    setTrigger("step2");
    setTrigger("step3");
    setTrigger(step4);
  }

  return (
    <>
      <div style={{ gap: ".25rem", display: "flex" }}>
        <button onClick={triggerAnimation}>trigger</button>
        <button onClick={() => setTrigger("default")}>reset</button>
      </div>

      <div
        ref={ref}
        style={{
          backgroundColor: "red",
          width: "100px",
          height: "100px",
          border: "5px solid blue",
          marginTop: "1rem",
        }}
      />
    </>
  );
};
