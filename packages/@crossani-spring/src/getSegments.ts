import { SpringCfg } from "./types";

const { sqrt, exp, sin, cos, abs } = Math;

// god help me how does one do spring math?????
// shoutouts to
// https://github.com/pomber/springs/blob/master/src/spring.js

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

function* getPoints(magnitude = 1, cfg: SpringCfg): Generator<[number, number]> {
  const sFn = getSamplierFn(magnitude, 0, 0, 0, cfg);

  for (let i = 0; 1; i += cfg.samples) {
    const [x, v] = sFn(i);

    if (
      Math.abs(magnitude - x) <= cfg.restThres &&
      Math.abs(v) <= cfg.restThres
    ) {
      yield [i, 1];
      return;
    }

    yield [i, x];
  }
}

export default function* getSegments(
  start: number,
  end: number,
  cfg: SpringCfg
): Generator<[number, number]> {
  const points = getPoints(end - start, cfg);

  let lastDifferenceSign: boolean | undefined = undefined;
  let lastPoint = points.next().value;

  if (!lastPoint) return [];

  let pointsLen = 0;
  for (const point of points) {
    pointsLen++;

    const difference = point[1] - lastPoint[1];

    if (lastDifferenceSign === undefined) {
      lastDifferenceSign = difference >= 0;
      continue;
    }

    // check if signs are different
    if (difference >= 0 !== lastDifferenceSign) {
      const timeLen = (1000 * pointsLen) / cfg.samples;

      yield [timeLen, point[1] + start];

      pointsLen = 0;
    }

    lastDifferenceSign = difference >= 0;
    lastPoint = point;
  }
}
