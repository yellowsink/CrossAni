# CrossAni

A silky smooth declarative animations lib for the web.

## Why CrossAni?

### Browser-Native Performance

A traditional animation library works by updating a property of an element repeatedly with JavaScript.

This is required for things like SVG elements, and is also much much easier for more complex animations such as springs.

However: this can have performance repurcussions.

CrossAni uses CSS transitions to fix this problem, using the browser's built in animating tools.

**CrossAni effectively guarantees 60fps animations every time**, or whatever refresh rate you run at.

The main other way to achieve this is the Web Animations API (WAAPI) like Motion One does.

### Size Matters

We live in an era of shaving milliseconds off load times, and a good chunk of this is JS bundle size.

CrossAni is _TINY_. As I write this it's 2.5KB raw or 1.12KB gzipped.
This is much smaller than the major animation libraries available (see comparisons further down).

## How does it behave?

Each element has an independent queue of pending animations.

When you run an animation it will be queued to run, or if the element is stationary, will animate immediately.

The queue will automatically run one-after-the-other until all animations are complete.

Any animations with `cutOff: true` set will interrupt the current animation,
cause all animations on the queue to finish instantly (we don't even transition them, just apply their changes!),
and then run itself as usual from the final styles applied by all preceeding animations.

CrossAni will only replace styles specified at each state.
If you do not want a state to allow leaving residue of the previous states, set `reset: true`.

All styles present on the element before the first animation ran will be respected,
and will be returned to those value after a reset.

Any _inline_ styles set after an animation has run on that element will readily be overwritten by CrossAni,
so be aware of that.

You can prevent this behaviour by calling `element.removeCrossAni()` after an animation.
This will remove any residual styles from transitions, but leave your `transitions `intact.

You can then modify the styles, and call `doTransition` as usual, re-initing that elem's animations

## How do I use it?

### (1) Assign some states to your element

Any element that should be animated can have a `transitions` property with a key-value record of strings to transition objects.

You may also pass transition objects directly to doTransition,
which is helpful for programmatically generated animations for example.

A transition object contains the following things:

- `ms`: the time it should take to finish transitioning to that state
- `easing`: An easing function to use, all exported on the `EASE` object.
- `state`: An object containing the CSS values to set on the element this state.
- `cutOff`: see behaviour above
- `reset`: see behaviour above
- `detached`: if true, this transition is completely independent of the global queue and runs instantly.

Transition objects allow all properties to be undefined, and will provide useful defaults:
```js
({
  state: {},
  ms: 100, // falls through from past transition, this value is for the first transition
  easing: EASE.ease, // see above comment
  cutOff: false,
  reset: false,
  detached: false
})
```

An example setup would be as follows:

```js
const box = document.getElementById("box");

box.transitions = {
  default: {
    ms: 500,
    easing: EASE.inOut,
    reset: true,
    cutOff: true,
  },

  hover: {
    state: { transform: "scale(1.1)" },
    ms: 250
  },
};
```

### (2) Get animating!

You may call `doTransition` on an element to cause it to animate to a named state.

The first time you do this, CrossAni will take a note of inline styles, as described before.

For, example, to continue with our box example:

```js
// ignore that this example could better be done
// with a :hover selector, this is just for the demo
box.onmouseover = () => box.doTransition("hover");
box.onmouseleave = () => box.doTransition("default");
```

### (3) Build up complex transitions with ease

Promises make complexity into simplicity

```js
async function introAnimation() {
  box.doTransition("moveright");
  box.doTransition("slowgrow");
  await box.doTransition("fadetextout");
  box.innerText = "the text is now different";
  box.doTransition("fadetextin");
  await box.doTransition("makemassive");
}
```

## What's the most performant?

`opacity`, `transform`, `filter`, as these are things that can be done in the compositor stage.

`background-color` and `clip-path` may be accelerated in Chrome too, but ensure to test in all browsers for optimum speed.

Non `transform` _movements_ are slower as, although the browser is running the animation,
repaints and often reflows are necessary, which are expensive.

To answer the more important question, what's the least performant, anything that could affect layout,
such as `margin`, `padding`, `width`, `height`, `font`, flex attributes, etc.

## How does CrossAni stack up?

Most benefits Motion One list also apply here:

- super small
- super smooth
- not affected by JS execution freezing
- high accuracy interpolation from the browser

However, CrossAni does not support some SVG attributes such as `d`.

### Bundle size

All packages were ran through [bundlejs](https://bundlejs.com) with esm.sh as the cdn.

| Pkg      | Raw     | Gzip    | Brotli  |
|----------|---------|---------|---------|
| crossani | 2.5kb   | 1.12kb  | 1.05kb  |
| motion   | 15.07kb | 6.34kb  | 6.17kb  |
| animejs  | 17.59kb | 7.19kb  | 6.99kb  |
| gsap     | 61.97kb | 24.45kb | 23.86kb |

### Features

|              |            Feature | CrossAni |  Motion  |   AnimeJS    | Greensock |
|--------------|-------------------:|:--------:|:--------:|:------------:|:---------:|
| **Values**   |    CSS `transform` |    ✅     |    ✅     |      ❌       |     ✅     |
|              |      Named colours |    ✅     |    ✅     |      ❌       |  Partial  |
|              |   Colour type conv |    ✅     |    ✅     | Wrong interp |     ✅     |
|              |   To/from CSS vars |    ✅     |    ✅     |      ❌       |     ❌     |
|              |  To/from CSS funcs |    ✅     |    ✅     |      ❌       |     ❌     |
|              |   Animate CSS vars |    ❌     |    ✅     |      ❌       |     ❌     |
|              |   Simple keyframes | ❌ Soon?  |    ✅     |      ✅       |     ❌     |
|              | Wildcard keyframes |   N/A    |    ✅     |      ❌       |     ❌     |
|              |    Relative values |    ❌     |    ✅     |      ❌       |     ❌     |
| **Output**   |     Element styles |    ✅     |    ✅     |      ✅       |     ✅     |
|              |      Element attrs |    ❌     |    ❌     |      ✅       |     ✅     |
|              |  Custom animations |    ❌     |    ✅     |      ✅       |     ✅     |
| **Options**  |           Duration |    ✅     |    ✅     |      ✅       |     ✅     |
|              |          Direction |    ✅     |    ✅     |      ✅       |     ✅     |
|              |             Repeat |    ❌     |    ✅     |      ✅       |     ✅     |
|              |              Delay |    ❌     |    ✅     |      ✅       |     ✅     |
|              |          End delay |    ❌     |    ✅     |      ✅       |     ✅     |
|              |       Repeat delay |    ❌     |    ✅     |      ❌       |     ✅     |
| **Stagger**  |            Stagger |    ❌     | ✅ +.1kb  |      ✅       |     ✅     |
| **Timeline** |           Timeline |    ❌     | ✅ +.6kb  |      ✅       |     ✅     |
| **Controls** |               Play |    ✅     |    ✅     |      ✅       |     ✅     |
|              |              Pause |    ❌     |    ✅     |      ✅       |     ✅     |
|              |             Finish |    ❌     |    ✅     |      ✅       |     ✅     |
|              |            Reverse |    ❌     |    ✅     |      ✅       |     ✅     |
|              |               Stop |    ❌     |    ✅     |      ✅       |     ✅     |
|              |      Playback rate |    ❌     |    ✅     |      ✅       |     ✅     |
| **Easing**   |             Linear |    ✅     |    ✅     |      ✅       |     ✅     |
|              |       Cubic bezier |    ✅     |    ✅     |      ✅       |     ✅     |
|              |              Steps |    ✅     |    ✅     |      ✅       |     ✅     |
|              |  Spring simulation |    ❌     |  ✅ +1kb  |      ❌       |     ❌     |
|              |              Glide |    ❌     | ✅ +1.3kb |      ❌       | ✅ $99/yr  |
|              |      Spring easing |    ❌     |    ❌     |      ✅       |     ❌     |
|              |     Custom easings |    ❌     |    ❌     |      ✅       |     ✅     |
| **Events**   |           Complete |    ✅     |    ✅     |      ✅       |     ✅     |
|              |             Cancel |    ^     |    ✅     |      ✅       |     ✅     |
|              |              Start |    ❌     |    ❌     |      ✅       |     ✅     |
|              |             Update |    ❌     |    ❌     |      ✅       |     ✅     |
|              |             Repeat |   N/A    |    ❌     |      ✅       |     ✅     |
| **Path**     |        Motion path |    ❌     |    ✅     |      ✅       | ✅ +9.5kb  |
|              |      Path morphing |    ❌     |  ✅ lib   | ✅ = #points  | ✅ $99/yr  |
|              |       Path drawing |    ✅     |    ✅     |      ✅       | ✅ $99/yr  |
| **Other**    |            license |   MIT    |   MIT    |     MIT      |  Custom   |
|              |   GPU acceleration |    ✅     |    ✅     |      ❌       |     ❌     |
|              |          IE11 (ew) |    ❌     |    ❌     |      ✅       |     ✅     |
|              |         Frameworks |    ✅     |    ✅     |      ❌       |     ❌     |
