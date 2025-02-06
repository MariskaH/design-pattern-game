import Game from "./Game";

/*
 * Singleton Pattern (Creational)
 * `Game.getInstance()` ensures only one instance of the game exists
 */
const game = Game.getInstance();
game.start();
