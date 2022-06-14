import { PartSpr, SpringCfg } from "./types";

export default (pCfg: PartSpr): SpringCfg => ({
  mass: 1,
  damping: 4,
  stiffness: 40,
  samples: 50,
  restThres: 0.1,
  ...pCfg,
});
