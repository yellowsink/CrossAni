import { PartSpr, SpringCfg } from "./types";

export default (pCfg: PartSpr): SpringCfg => ({
  mass: 2,
  samples: 50,
  stiffness: 50,
  damping: 3,
  restThres: 0.001,
  ...pCfg,
});
