import { stateStore } from "./shared";

export * from "./easing";

HTMLElement.prototype.doTransition = function (name) {
  if (!this.transitions)
    throw new Error(`${this.tagName} #${this.id} does not have transitions`);

  const transition = this.transitions[name];

  if (!transition)
    throw new Error(`${this.tagName} #${this.id} has no transition "${name}"`);
};
