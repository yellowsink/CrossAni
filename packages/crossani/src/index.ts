import { abortAnimation, popAll, startAnimating } from "./animator";
import remove from "./remove";
import { stateStore } from "./shared";
import {
  getPromise,
  queueTransition,
  sanitiseTransitions,
  whenTransitionAborts,
} from "./util";

export { EASE, JUMP } from "./generator";

export function load() {
  SVGElement.prototype.doTransition = HTMLElement.prototype.doTransition =
    function (name): Promise<void> {
      if (!this.transitions)
        throw new Error(
          `${this.tagName} #${this.id} does not have transitions`
        );

      // just to be sure the user isnt breaking things
      sanitiseTransitions(this);

      const transition = this.transitions[name];

      if (!transition)
        throw new Error(
          `${this.tagName} #${this.id} has no transition "${name}"`
        );

      if (transition.cutOff) {
        abortAnimation(this);
        popAll(this);
      }

      const notAnimating = queueTransition(this, transition);
      if (notAnimating) {
        if (!transition.cutOff) startAnimating(this);
        // wait for the transition to snap to the end
        // or itll start from halfway through the previous transition
        else whenTransitionAborts(this, () => startAnimating(this));
      }

      return getPromise(this, transition);
    };

  remove();

  const orig = Element.prototype.remove;
  Element.prototype.remove = function () {
    stateStore.delete(this as HTMLElement | SVGElement);
    orig.call(this);
  };
}

export const unload = () => {
  for (const elem of stateStore.keys()) elem.removeCrossAni();

  // @ts-expect-error, shut up TS
  delete SVGElement.prototype.doTransition;
  // @ts-expect-error, shut up TS
  delete HTMLElement.prototype.doTransition;
  // @ts-expect-error, shut up TS
  delete SVGElement.prototype.removeCrossAni;
  // @ts-expect-error, shut up TS
  delete HTMLElement.prototype.removeCrossAni;
};
