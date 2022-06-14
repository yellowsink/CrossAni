import { abortAnimation, popAll, startAnimating } from "./animator";
import { stateStore } from "./shared";
import {
  getOrInitStore,
  queueTransition,
  sanitiseTransitions,
  updateStyles,
  whenTransitionAborts,
} from "./util";

export { EASE, JUMP } from "./generator";

SVGElement.prototype.doTransition = HTMLElement.prototype.doTransition =
  function (transOrName) {
    // just to be sure the user isnt breaking things
    sanitiseTransitions(this);

    const trans =
      typeof transOrName !== "object"
        ? this.transitions?.[transOrName]
        : transOrName;

    if (!trans)
      throw new Error(
        `${this.tagName} #${this.id} has no transition "${transOrName}"`
      );

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

export const unload = () => {
  for (const elem of stateStore.keys()) elem.removeCrossAni();
};

export type { Transition } from "./types";
