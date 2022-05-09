import { popAll } from "./animator";
import { stateStore } from "./shared";
import { getOrInitStore, updateStyles } from "./util";

export default () =>
  (SVGElement.prototype.removeCrossAni = HTMLElement.prototype.removeCrossAni =
    function () {
      const store = getOrInitStore(this);
      popAll(this);
      store.curr = {};
      updateStyles(this);
      stateStore.delete(this);
    });
