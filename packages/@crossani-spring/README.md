# CrossAni spring

A silky smooth spring animation tool built on CrossAni.

## Installation

- `npm i @crossani/spring`
- `pnpm i @crossani/spring`
- `yarn add @crossani/spring`

## Usage

1. Import `@crossani/spring`
2. Make your divs bouncy
```js
import "@crossani/spring";

const box = document.getElementById("box");
box.doSpring(
  0, // start value - used for math calculations but not transitioning
  100, // target value
  "margin", // prop
  "px", // unit OR template to place current value into
  // OPTIONAL - spring config - defaults shown
  {
    mass: 1, // how heavy the weight on the spring is
    damping: 4, // how quickly the spring loses energy
    stiffness: 40, // how much force the spring wants to apply
    // you should not need to touch these two at all
    // only touch if you have issues e.g. super high frequency springs
    samples: 50, // internal, calculation samples
    restThres: .1 // internal, thres to consider a spring at its target
  }
);

// example for template instead of unit
box.doSpring(0, 100, "transform", "translateX(<>px)");
```

3. Stop any currently moving springs
Will not immediately snap animations to completion, but will stop at the next key point.
```js
box.abortSprings();
```
