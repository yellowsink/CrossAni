import { SpringCfg } from "./types";

export default (pCfg: Partial<SpringCfg>): SpringCfg => ({
  mass: 2,
  samples: 50,
  stiffness: 50,
  damping: 3,
  restThres: .001,
  ...pCfg,
});
