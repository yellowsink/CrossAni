import {initFlipAgnostic} from "./agnostic";

async function animate(e: HTMLElement, ms: number, easing: string, state: Record<string, string>) {

	const waapiState: Record<string, string> = {};

	for (const k in state)
		// isn't WAAPI great?
		waapiState[k] = state[k] || "unset";

	await e.animate({
		easing,
		...waapiState
	}, ms).finished;

	Object.assign(e.style, state);
}

initFlipAgnostic(
	() => Promise.resolve(),
	(e, k, v) => e.style[k as any] = v,
	animate
);

export {batchFlip} from "./agnostic";