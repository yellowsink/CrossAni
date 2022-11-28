import "crossani";
import {initFlipAgnostic} from "./agnostic";

initFlipAgnostic(
	(e) => e.forcePop(),
	(e, k, v) => e.caSet(k, v),
	(e, ms, easing, state) => e.doTransition({ms, easing, state}).then(() => {
		e.style.transition = "";
	}),
);

export {batchFlip} from "./agnostic";