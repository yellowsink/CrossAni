declare global {
    interface Element {
        doSpring: () => Promise<void>
    }
}
export {};