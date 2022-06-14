import "./style.css";
import "@crossani/spring";

const box = document.getElementById("box");

let isDragging = false;
let boxPos = [200, 200];

const calcPos = (curP, boxP, boxS) => Math.max(0, curP - boxP - boxS / 2);

window.addEventListener("mousemove", (ev) => {
  boxPos = [
    calcPos(ev.clientX, box.offsetLeft, box.clientWidth),
    calcPos(ev.clientY, box.offsetTop, box.clientHeight),
  ];
  if (isDragging) {
    box.style.left = boxPos[0] + "px";
    box.style.top = boxPos[1] + "px";
  }
});

box.addEventListener("mousedown", () => {
  isDragging = true;
  box.removeCrossAni();
  box.style.left = "200px";
  box.style.top = "200px";
});
box.addEventListener("mouseup", () => {
  isDragging = false;
  box.doSpring(boxPos[0], 200, "left", "px");
  box.doSpring(boxPos[1], 200, "top", "px");
});
