export interface SpringCfg {
    // idk what on earth these do
    // https://springs.pomb.us/
    // https://github.com/pomber/springs/blob/master/src/spring.js
    mass: number // m
    stiffness: number // k
    damping: number // c
    precision: number
    restVelocity?: number
}