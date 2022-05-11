/* @refresh reload */
import { render } from "solid-js/web";
import { Component, createSignal } from "solid-js";

// use:crossani
import crossani from "solid-crossani";
// minified away, stops TSC removing the import
false && crossani;

import { EASE, PartialTransition } from "crossani";

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
  easing: EASE.inOut,
};

const App: Component = () => {
  const [trigger, setTrigger] = createSignal<string | PartialTransition>("");
  const [current, setCurrent] = createSignal<string | PartialTransition>();

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

        {typeof current() === "string" ? (
          <>{current()}</>
        ) : current() === undefined ? (
          <em>Not currently animating</em>
        ) : (
          <em>Custom animation</em>
        )}
      </div>

      <div
        // tie crossani to this component, passing our trigger signal
        use:crossani={[trigger, setCurrent]}
        // set our initial styles. CrossAni will respect these styles.
        style={{
          "background-color": "red",
          width: "100px",
          height: "100px",
          border: "5px solid blue",
          "margin-top": "1rem",
        }}
        // @ts-expect-error - currently figuring out a way to do this
        prop:transitions={transitions}
      />
    </>
  );
};

render(() => <App />, document.getElementById("root") as HTMLElement);
