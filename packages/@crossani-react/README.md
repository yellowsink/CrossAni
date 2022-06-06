## React CrossAni

Bringing the awesome CrossAni transition and animation framework to ReactJS.

## Installation

Install @crossani/react and crossani:

- `npm i crossani @crossani/react`
- `pnpm i crossani @crossani/react`
- `yarn add crossani @crossani/react`

That's it.

## Usage

1. In your component, import `EASE` from crossani and `useCrossani` from @crossani/react, like so:

```jsx
import {EASE} from "crossani";
import useCrossani from "@crossani/react";
```

2. Add a `hook call`, and connect to the dom:

```jsx
export default () => {
	const [ref, triggerAni] = useCrossani();

	return <div ref={ref}>{/* ... */}</div>;
};
```

3. Add some transitions (see the main CrossAni readme for a better explanation of the transition format):

```jsx
export default () => {
	const [ref, triggerAni] = useCrossani({
		default: {
			state: {},
			reset: true,
			cutOff: true,
			ms: 500,
			easing: EASE.inOut,
		},
		alternate: {
			state: {"margin-top": "2rem"},
			ms: 250,
			easing: EASE.out,
		},
	});

	return <div ref={ref}>{/* ... */}</div>;
};
```

4. Run your transitions!!!

```jsx
export default () => {
	const [ref, triggerAni] = useCrossani({...});

	useEffect(() => triggerAni("alternate"), []);

	return <div ref={ref}>{/* ... */}</div>;
};
```