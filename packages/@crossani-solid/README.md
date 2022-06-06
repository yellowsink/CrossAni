## Solid CrossAni

Bringing the awesome CrossAni transition and animation framework to SolidJS.

## Installation

Install @crossani/solid and crossani:

- `npm i crossani @crossani/solid`
- `pnpm i crossani @crossani/solid`
- `yarn add crossani @crossani/solid`

That's it.

## Usage

1. In your component, import `EASE` from crossani and import `solid-crossani`, like so:

```jsx
import { EASE } from "crossani";
import crossani from "@crossani/solid";
// !!!! this may be required to stop vite and/or typescript
// !!!! removing the import even though you do need it
false && crossani; // it will be minified out of your dist.
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
          easing: EASE.out,
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
