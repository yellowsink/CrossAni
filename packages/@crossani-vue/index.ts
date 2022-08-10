import "crossani";
import type { Directive, VNode } from "vue";
import { unref } from "vue";
import type { Transition } from "crossani";

// https://stackoverflow.com/a/49266124/8388655
const dispatch = (el: Element, vnode: VNode, name: string, detail: any) =>
  vnode.component
    ? vnode.component.emit(name, { detail })
    : el.dispatchEvent(new CustomEvent(name, { detail }));

const eData = new WeakMap<
  Element,
  { q: (string | Transition)[]; l: string | Transition | undefined }
>();

type DirectiveOpts =
  | string
  | Transition
  | [Record<string, Transition> | undefined, string | Transition];

export default {
  mounted: (el) => eData.set(el, { q: [], l: undefined }),

  unmounted: (el) => eData.delete(el),

  updated(el, binding, vnode) {
    const data = eData.get(el)!; // typescript hates him!

    el.transitions = Array.isArray(binding.value)
      ? unref(binding.value[0]) ?? {}
      : {};

    const trans = Array.isArray(binding.value)
      ? binding.value[1]
      : binding.value;

    //debugger;
    if (trans === data.l) return;
    data.l = trans;

    if (typeof trans !== "object" && !el.transitions?.[trans]) return;

    if (
      (typeof trans === "object" ? trans : el.transitions?.[trans])?.detached
    ) {
      el.doTransition(trans);
      return;
    }

    if (data.q.length === 0) dispatch(el, vnode, "animated", trans);

    data.q.push(trans);

    el.doTransition(trans).then(() => {
      data.q.shift();
      dispatch(el, vnode, "animated", data.q[0]);
    });
  },
} as Directive<HTMLElement | SVGElement, DirectiveOpts>;
