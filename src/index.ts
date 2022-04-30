import { startAnimating } from "./animator";
import { EASE, JUMP } from "./generator";
import { getPromise, queueTransition, sanitiseTransitions } from "./util";

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

    const notAnimating = queueTransition(this, transition);
    if (notAnimating) startAnimating(this);

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
