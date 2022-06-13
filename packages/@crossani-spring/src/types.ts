export interface SpringCfg {
  mass: number; // m
  stiffness: number; // k
  damping: number; // c
  samples: number;
  restThres: number;
}

export type PartSpr = Partial<SpringCfg>;
