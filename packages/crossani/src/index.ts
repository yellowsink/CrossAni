import { abortAnimation, popAll, startAnimating } from "./animator";
import { stateStore } from "./shared";
import {
  getOrInitStore,
  queueTransition,
  sanitiseTransitions,
  transitionDefaults,
  updateStyles,
  whenTransitionAborts,
} from "./util";

export { EASE, JUMP } from "./generator";

SVGElement.prototype.doTransition = HTMLElement.prototype.doTransition =
  function (transOrName): Promise<void> {
    // just to be sure the user isnt breaking things
    sanitiseTransitions(this);

    const rawTrans =
      typeof transOrName === "string"
        ? this.transitions?.[transOrName]
        : transOrName;

    if (!rawTrans)
      throw new Error(
        `${this.tagName} #${this.id} has no transition "${transOrName}"`
      );

    const trans = transitionDefaults(rawTrans);

    if (trans.cutOff) {
      abortAnimation(this);
      popAll(this);
    }

    const [notAnimating, promise] = queueTransition(this, trans);

    if (notAnimating) {
      if (!trans.cutOff) startAnimating(this);
      // wait for the transition to snap to the end
      // or itll start from halfway through the previous transition
      else whenTransitionAborts(this, () => startAnimating(this));
    }

    return promise;
  };

SVGElement.prototype.removeCrossAni = HTMLElement.prototype.removeCrossAni =
  function () {
    const store = getOrInitStore(this);
    popAll(this);
    store.curr = {};
    this.style.transition = "";
    updateStyles(this);
    stateStore.delete(this);
  };

const orig = Element.prototype.remove;
Element.prototype.remove = function () {
  stateStore.delete(this as HTMLElement | SVGElement);
  orig.call(this);
};

export const unload = () => {
  for (const elem of stateStore.keys()) elem.removeCrossAni();
};

export { Transition, PartialTransition } from "./types";
