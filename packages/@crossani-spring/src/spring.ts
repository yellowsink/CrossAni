import { SpringCfg } from "./types";

const { sqrt, exp, sin, cos, abs } = Math;

// god help me how does one do spring math?????
// shoutouts to
// https://github.com/pomber/springs/blob/master/src/spring.js

// simplified from the linked file to force x0 to -1 and v0 to 0
// returns [value, velocity]
function getSampleFn(
  cfg: SpringCfg,
  x0: number,
  vel0: number
): (x: number) => [number, number] {
  const { stiffness, damping, mass } = cfg;

  // a radicand is a value that will be sqrt'd btw
  const radicand = damping * damping - 4 * stiffness * mass;
  const rooted = sqrt(abs(radicand));

  if (radicand === 0) {
    const r = -damping / (2 * mass);
    const b = vel0 - r * x0;

    return (t) => [
      (x0 * t + b) * exp(r * t),
      (b + x0 * r + b * r * t) * exp(r * t),
    ];
  }

  if (radicand > 0) {
    const rp = (-damping + rooted) / (2 * mass);
    const rn = (-damping - rooted) / (2 * mass);
    const a = (x0 - rp * vel0) / (rp - rn);
    const b = (vel0 - x0 * rn) / (rp - rn);

    return (t) => [
      a * exp(rn * t) + b * exp(rp * t),
      a * rn * exp(rn * t) + b * rp * exp(rp * t),
    ];
  }

  // radicand < 0

  const r = -damping / (2 * mass);
  const s = rooted / (2 * mass);
  const b = (vel0 - r * x0) / s;

  return (t) => [
    exp(r * t) * (x0 * cos(s * t) + b * sin(s * t)),
    exp(r * t) *
      ((b * s + x0 * r) * cos(s * t) - (x0 * s - b * r) * sin(s * t)),
  ];
}

// sample function 2: the samplening
// too tired to work out how this is different and better
function getSamplierFn(
  target: number,
  x0: number,
  v0: number,
  start: number,
  cfg: SpringCfg
) {
  const sfn = getSampleFn(cfg, target - x0, v0);

  return (now: number) => {
    const [x, v] = sfn((now - start) / 1000);
    return [target - x, v];
  };
}

function getPoints(
  start: number,
  end: number,
  //v0: number,
  cfg: SpringCfg
): [number, number][] {
  const points: [number, number][] = [];

  const sFn = getSamplierFn(end, 0, 0, start, cfg);

  for (let i = start; 1; i += cfg.precision) {
    const [x, v] = sFn(i);
    points.push([i, x]);

    if (x !== start && Math.abs(v) <= (cfg.restVelocity ?? cfg.precision)) {
      points[points.length - 1][0] = end;
      break;
    }
  }

  return points;
}
