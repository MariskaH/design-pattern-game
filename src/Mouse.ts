export default class Mouse
{
    private observers: { onClick: ((x: number, y: number) => void)[] } = { onClick: [] };

    /*
     * Observer Pattern (Behavioral)
     * `Mouse.ts` listens for clicks and notifies `Game.ts`
     * Allows multiple functions to register via `onClick()`
     */
    constructor(canvas: HTMLCanvasElement)
    {
        canvas.addEventListener("mouseup", (event) =>
        {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            console.log(`Mouse clicked at (${ x }, ${ y })`);

            // Notify all registered observers
            this.observers.onClick.forEach((observer) => observer(x, y));
        });
    }

    /*
     * Registers an observer for mouse clicks
     * Allows `Game.ts` to react dynamically
     */
    onClick(callback: (x: number, y: number) => void)
    {
        this.observers.onClick.push(callback);
    }
}
