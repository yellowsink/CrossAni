import "crossani";

interface ObjectFlipState {
  absPos: [number, number];
  absSize: [number, number];
  trans: string;
  indivTrans: { translate: string; rotate: string; scale: string };
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
    indivTrans: {
      translate: element.style.translate ?? "",
      rotate: element.style.rotate ?? "",
      scale: element.style.scale ?? "",
    },
  };
}

HTMLElement.prototype.doFlip = async function (ms, easing, effectCb) {
  const flipData = await this.startFlip(ms, easing);
  const e = await effectCb();
  return await (e ?? this).applyFlip(flipData);
};

HTMLElement.prototype.startFlip = async function (ms, easing) {
  await this.forcePop();
  return {
    ms,
    easing,
    preState: getFlipState(this),
  };
};

HTMLElement.prototype.applyFlip = async function ({ ms, easing, preState }) {
  const currentState = getFlipState(this);

  // TODO account for parent transforms like GSAP does

  const indivTransforms =
    (preState.indivTrans.translate
      ? `translate(${preState.indivTrans.translate})`
      : "") +
    (preState.indivTrans.rotate
      ? `rotate(${preState.indivTrans.rotate})`
      : "") +
    (preState.indivTrans.scale
      ? `scale(${preState.indivTrans.scale})`
      : "");

  const neededTrans = `translate(\
${preState.absPos[0] - currentState.absPos[0]}px, \
${preState.absPos[1] - currentState.absPos[1]}px)`;

  const neededScale = `scale(\
${preState.absSize[0] / currentState.absSize[0]}, \
${preState.absSize[1] / currentState.absSize[1]})`

  this.caSet("transform", neededTrans + indivTransforms + neededScale + preState.trans);
  this.caSet("translate", "");
  this.caSet("rotate", "");
  this.caSet("scale", "");

  await new Promise((res) => requestAnimationFrame(res));

  await this.doTransition({
    ms,
    easing,
    state: {
      transform: currentState.trans,
      ...currentState.indivTrans,
    },
  });

  this.style.transition = ""
};

export async function batchFlip(
  ms: number,
  easing: string,
  elems: HTMLElement[],
  effectCb: () => Promise<void>
) {
  const flipDatas = await Promise.all(elems.map((e) => e.startFlip(ms, easing)));
  await effectCb();
  await Promise.all(elems.map((e, i) => e.applyFlip(flipDatas[i])));
}
