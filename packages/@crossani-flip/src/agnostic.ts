type IndividualTransforms = {
	translate: string;
	rotate: string;
	scale: string;
};

interface ObjectFlipState {
	absPos: [number, number];
	absSize: [number, number];
	trans: string;
	fullTrans: string;
	indivTrans: IndividualTransforms;
}

interface FlipData {
	preState: ObjectFlipState;
	ms: number;
	easing: string;
}

declare global {
	interface HTMLElement {
		doFlip(
			ms: number,
			easing: string,
			effectCb: () => HTMLElement | void | Promise<HTMLElement | void>
		): Promise<void>;

		startFlip(ms: number, easing: string): Promise<FlipData>;

		applyFlip(flipData: FlipData): Promise<void>;
	}
}

function getFlipState(element: HTMLElement): ObjectFlipState {
	return {
		absPos: [element.offsetLeft, element.offsetTop],
		absSize: [element.offsetWidth, element.offsetHeight],
		trans: element.style.transform,
		fullTrans: allTransforms(element),
		indivTrans: {
			translate: element.style.translate ?? "",
			rotate: element.style.rotate ?? "",
			scale: element.style.scale ?? "",
		},
	};
}

// getComputedStyle(e).transform would consolidate all of this into simply a matrix(...) but I don't trust the perf
const resolveTransform = (trans: string, it: IndividualTransforms) =>
	(it.translate ? `translate(${it.translate})` : "") +
	(it.rotate ? `rotate(${it.rotate})` : "") +
	(it.scale ? `scale(${it.scale})` : "") +
	trans;

function allTransforms(e: HTMLElement) {
	let transforms = resolveTransform(e.style.transform, {
		translate: e.style.translate,
		rotate: e.style.rotate,
		scale: e.style.scale,
	});

	while (e.parentElement && e.parentElement !== document.body) {
		e = e.parentElement;

		transforms =
			resolveTransform(e.style.transform, {
				translate: e.style.translate,
				rotate: e.style.rotate,
				scale: e.style.scale,
			}) + transforms;
	}

	return transforms;
}

const negateTransform = (transform: string) =>
	transform
		.split(/(?<=^|\)) /g)
		.reverse()
		.join(" ")
		.replaceAll(
			/\((.+?)\)/g,
			(_, p1: string) =>
				"(" +
				p1
					.split(/,\s*/g)
					.map((s) => "-" + s)
					.join(", ") +
				")"
		);

export function initFlipAgnostic(
	forcePop: (e: HTMLElement) => Promise<void>,
	set: (e: HTMLElement, k: string, v: string) => void,
	transition: (e: HTMLElement, ms: number, easing: string, state: Record<string, string>) => Promise<void>) {
	HTMLElement.prototype.doFlip = async function (ms, easing, effectCb) {
		const flipData = await this.startFlip(ms, easing);
		const e = await effectCb();
		return await (e ?? this).applyFlip(flipData);
	};

	HTMLElement.prototype.startFlip = async function (ms, easing) {
		await forcePop(this);
		return {
			ms,
			easing,
			preState: getFlipState(this),
		};
	};

	HTMLElement.prototype.applyFlip = async function ({ms, easing, preState}) {
		const currentState = getFlipState(this);

		const neededTrans = `translate(\
${preState.absPos[0] - currentState.absPos[0]}px, \
${preState.absPos[1] - currentState.absPos[1]}px)`;

		const neededScale = `scale(\
${preState.absSize[0] / currentState.absSize[0]}, \
${preState.absSize[1] / currentState.absSize[1]})`;

		set(
			this,
			"transform",
			neededTrans +
			negateTransform(currentState.fullTrans) +
			preState.fullTrans +
			neededScale
		);
		set(this, "translate", "");
		set(this, "rotate", "");
		set(this, "scale", "");

		await new Promise((res) => requestAnimationFrame(res));

		await transition(
			this, ms, easing, {
				transform: currentState.trans,
				...currentState.indivTrans,
			});
	};
}

export async function batchFlip(
	ms: number,
	easing: string,
	elems: HTMLElement[],
	effectCb: () => Promise<void>
) {
	const flipDatas = await Promise.all(
		elems.map((e) => e.startFlip(ms, easing))
	);
	await effectCb();
	await Promise.all(elems.map((e, i) => e.applyFlip(flipDatas[i])));
}
