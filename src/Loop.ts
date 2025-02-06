import Game from "./Game";

export default class Loop
{
    private isRunning = false;
    private game: Game;

    /*
     * Template Method Pattern (Behavioral)
     * Defines a fixed game execution order:
     *   1. `update()` - Process game logic
     *   2. `draw()` - Render visuals
     *   3. `requestAnimationFrame()` - Repeat
     */
    constructor(game: Game)
    {
        this.game = game;
    }

    /*
     * Starts the game loop
     * Ensures `step()` is continuously called
     */
    start()
    {
        this.isRunning = true;
        this.step();
    }

    /*
     * Stops the game loop
     * Prevents unnecessary processing when the game is over
     */
    stop()
    {
        this.isRunning = false;
    }

    private step()
    {
        if (!this.isRunning) return;
        this.game.update();
        this.game.draw();
        requestAnimationFrame(() => this.step());
    }
}
