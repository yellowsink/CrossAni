import { abortAnimation, popAll, startAnimating } from "./animator";
import { EASE, JUMP } from "./generator";
import {
  getPromise,
  queueTransition,
  sanitiseTransitions,
  whenTransitionAborts,
} from "./util";

export { EASE, JUMP } from "./generator";

export function load() {
  HTMLElement.prototype.doTransition = function (name): Promise<void> {
    if (!this.transitions)
      throw new Error(`${this.tagName} #${this.id} does not have transitions`);

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
}

// @ts-expect-error, shut up TS
export const unload = () => delete HTMLElement.prototype.doTransition;

// DEBUG //
load();
// @ts-expect-error
window.EASE = EASE;
// @ts-expect-error
window.JUMP = JUMP;
