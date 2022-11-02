# CrossAni FLIP

A silky smooth dynamic layout animation tool built on CrossAni.

## Installation

- `npm i @crossani/flip`
- `pnpm i @crossani/flip`
- `yarn add @crossani/flip`

## Usage

1. Import `@crossani/flip`
2. Call `elem.doFlip()`
3. In the callback, mutate the DOM
   * Feel free to move the element in the hierarchy
   * Feel free to return literally an entirely different element to switch to
   * Make sure to update inline styles via `caSet` to keep internal stores synced
   * It will look weird if you are transforming *from* a transform with a `matrix(...)` in it (to works fine)

You can also start and end FLIPs via two separate functions, for more flexibility.
There is a pre-provided function for batch-FLIPping an array of elements.

```js
import { EASE } from "crossani";
import "@crossani/flip";

const box = document.getElementById("box");
box.doFlip(
  500,
  EASE.ease,
  () => {
    box.caSet("margin", "5rem");
    newParent.append(box);
    box.caSet("scale", "1.25 0.75");
  }
).then(() => console.log("done"));
