## Solid CrossAni

Bringing the awesome CrossAni transition and animation framework to SolidJS.

## Adding to your Solid project

1. Install solid-crossani and crossani: `npm i crossani solid-crossani`

2. In your `index.jsx`, make sure to init CrossAni:

```jsx
import { load as loadCrossani } from "crossani";

/* mounting app etc */

// don't worry about accidentally calling this more than once
loadCrossani();
```

## Using in your components

1. In your component, import `EASE` from crossani and import `solid-crossani`, like so:

```jsx
import { EASE } from "crossani";
import crossani from "solid-crossani";
// !!!! this may be required to stop vite and/or typescript
// !!!! removing the import even though you do need it
false && crossani; // it will be minified out of existence.
```

2. Create a signal to trigger animations, and add a `use:crossani`:

```jsx
export default () => {
  const [triggerAni, setTriggerAni] = createSignal("");

  return <div use:crossani={triggerAni}>{/* ... */}</div>;
};
```

3. Add some transitions (see the main CrossAni readme for a better explanation of the transition format):

```jsx
export default () => {
  const [triggerAni, setTriggerAni] = createSignal("");

  return (
    <div
      use:crossani={triggerAni}
      prop:transitions={{
        default: {
          state: {},
          reset: true,
          cutOff: true,
          ms: 500,
          easing: EASE.inOut,
        },
        alternate: {
          state: { "margin-top": "2rem" },
          ms: 250,
          easing: out,
        },
      }}
    >
      {/* ... */}
    </div>
  );
};
```

4. Run your transitions!!!

```jsx
export default () => {
  const [triggerAni, setTriggerAni] = createSignal("");

  onMount(() => setTriggerAni("alternate"));

  return (
    <div use:crossani={triggerAni} prop:transitions={/* ... */}>
      {/* ... */}
    </div>
  )
}
```

5. **OPTIONAL!!** Get the current transition state as a signal

```jsx
export default () => {
  const [triggerAni, setTriggerAni] = createSignal("");
  const [aniState, setAniState] = createSignal();

  return (
    <div use:crossani={[triggerAni, setAniState]} prop:transitions={/* ... */}>
      Current state: {aniState() ?? <em>not animating</em>}

      {/* ... */}
    </div>
  )
}
```
