/*
 * Composite Pattern (Structural)
 * `Game.ts` stores multiple `Entity` objects in `entities[]`
 * Each object updates independently but is part of one list
 */
define("Entity", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TriangleEntity = exports.SquareEntity = exports.CircleEntity = exports.Entity = void 0;
    class Entity {
        constructor(name, x, y, radius, color) {
            this.name = name;
            this.x = x;
            this.y = y;
            this.color = color;
            this.radius = radius;
            this.dx = Math.random() * 4 - 2; // Random speed
            this.dy = Math.random() * 4 - 2;
        }
        /*
         * Template Method Pattern (Behavioral)
         * `update()` method ensures objects always move and bounce off walls
         * The structure is fixed, but behavior can be changed per shape
         */
        update(canvasWidth, canvasHeight) {
            this.x += this.dx;
            this.y += this.dy;
            if (this.x - this.radius <= 0 || this.x + this.radius >= canvasWidth)
                this.dx *= -1;
            if (this.y - this.radius <= 0 || this.y + this.radius >= canvasHeight)
                this.dy *= -1;
        }
        draw(ctx) { }
        /*
         * Dynamic Difficulty Scaling
         * Called in `Game.ts` every 30 seconds to make game harder
         */
        increaseSpeed() {
            this.dx *= 1.1;
            this.dy *= 1.1;
        }
    }
    exports.Entity = Entity;
    /*
     * Factory-Like Behavior (Creational)
     * `Game.ts` randomly picks one of these classes when spawning objects
     */
    class CircleEntity extends Entity {
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
    exports.CircleEntity = CircleEntity;
    class SquareEntity extends Entity {
        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }
    }
    exports.SquareEntity = SquareEntity;
    class TriangleEntity extends Entity {
        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.radius);
            ctx.lineTo(this.x - this.radius, this.y + this.radius);
            ctx.lineTo(this.x + this.radius, this.y + this.radius);
            ctx.closePath();
            ctx.fill();
        }
    }
    exports.TriangleEntity = TriangleEntity;
});
define("Loop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Loop {
        /*
         * Template Method Pattern (Behavioral)
         * Defines a fixed game execution order:
         *   1. `update()` - Process game logic
         *   2. `draw()` - Render visuals
         *   3. `requestAnimationFrame()` - Repeat
         */
        constructor(game) {
            this.isRunning = false;
            this.game = game;
        }
        /*
         * Starts the game loop
         * Ensures `step()` is continuously called
         */
        start() {
            this.isRunning = true;
            this.step();
        }
        /*
         * Stops the game loop
         * Prevents unnecessary processing when the game is over
         */
        stop() {
            this.isRunning = false;
        }
        step() {
            if (!this.isRunning)
                return;
            this.game.update();
            this.game.draw();
            requestAnimationFrame(() => this.step());
        }
    }
    exports.default = Loop;
});
define("Mouse", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mouse {
        /*
         * Observer Pattern (Behavioral)
         * `Mouse.ts` listens for clicks and notifies `Game.ts`
         * Allows multiple functions to register via `onClick()`
         */
        constructor(canvas) {
            this.observers = { onClick: [] };
            canvas.addEventListener("mouseup", (event) => {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                console.log(`Mouse clicked at (${x}, ${y})`);
                // Notify all registered observers
                this.observers.onClick.forEach((observer) => observer(x, y));
            });
        }
        /*
         * Registers an observer for mouse clicks
         * Allows `Game.ts` to react dynamically
         */
        onClick(callback) {
            this.observers.onClick.push(callback);
        }
    }
    exports.default = Mouse;
});
define("Game", ["require", "exports", "Loop", "Mouse", "Entity"], function (require, exports, Loop_1, Mouse_1, Entity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        /*
         * Singleton Pattern (Creational)
         * Ensures only one instance of `Game.ts` exists.
         * Prevents multiple games running at the same time.
         */
        constructor() {
            this.entities = [];
            this.score = 0;
            this.timer = 120;
            this.isGameOver = false;
            this.colorOffset = 0;
            this.popSound = new Audio("assets/pop.mp3");
            this.removeSound = new Audio("assets/remove.mp3");
            this.canvas = document.getElementById("game");
            this.ctx = this.canvas.getContext("2d");
            if (!this.canvas || !this.ctx) {
                throw new Error("Canvas element or context could not be initialized");
            }
            // Set fixed canvas size
            this.canvas.width = 512;
            this.canvas.height = 512;
            // Facade Pattern (Structural)
            // `Game.ts` manages game logic (updates, rendering, input handling)
            // Other classes (`Loop.ts`, `Mouse.ts`, `Entity.ts`) do not need to control game flow
            this.loop = new Loop_1.default(this);
            this.mouse = new Mouse_1.default(this.canvas);
            this.mouse.onClick((x, y) => this.handleMouseClick(x, y));
            // Start game loop
            this.loop.start();
            // Progressive Difficulty
            // Every 30 seconds, objects move faster
            setInterval(() => {
                if (!this.isGameOver && this.timer > 0) {
                    this.timer--;
                    if (this.timer % 30 === 0) {
                        this.entities.forEach(entity => {
                            entity.increaseSpeed();
                        });
                    }
                }
                else if (this.timer <= 0) {
                    this.isGameOver = true;
                }
            }, 1000);
        }
        static getInstance() {
            if (!Game.instance) {
                Game.instance = new Game();
            }
            return Game.instance;
        }
        start() {
            this.loop.start();
        }
        /*
         * Composite Pattern (Structural)
         * `entities[]` stores multiple objects dynamically
         * Objects are updated, drawn, and deleted **as part of one structure**
         */
        update() {
            if (this.isGameOver)
                return;
            this.entities.forEach(entity => entity.update(this.canvas.width, this.canvas.height));
        }
        /*
         * Template Method Pattern (Behavioral)
         * `update()` and `draw()` define the fixed execution orde every frame
         *  Step 1:Update all objects
         *  Step 2:Draw everything
         *  Step 3:Repeat every frame
         */
        draw() {
            // Dynamic Background Animation
            this.colorOffset += 0.005;
            const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            gradient.addColorStop(0, `hsl(${(this.colorOffset * 100) % 360}, 100%, 50%)`);
            gradient.addColorStop(1, "#2C5364");
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            // Draw all entities
            this.entities.forEach(entity => entity.draw(this.ctx));
            // Display score and timer
            this.ctx.fillStyle = "white";
            this.ctx.font = "20px Arial";
            this.ctx.fillText(`Score: ${this.score}`, 10, 30);
            this.ctx.fillText(`Time Left: ${this.timer}s`, 10, 60);
            if (this.isGameOver) {
                this.ctx.fillStyle = "red";
                this.ctx.font = "40px Arial";
                this.ctx.fillText("Game Over!", this.canvas.width / 2 - 100, this.canvas.height / 2);
                this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2 - 120, this.canvas.height / 2 + 50);
            }
        }
        /*
         * Observer Pattern (Behavioral)
         * `Mouse.ts` detects clicks and **notifies `Game.ts`
         * `Game.ts` reacts dynamically (removing or adding objects)
         */
        handleMouseClick(x, y) {
            if (this.isGameOver)
                return;
            // Check if an object was clicked
            const index = this.entities.findIndex(entity => Math.sqrt((x - entity.x) ** 2 + (y - entity.y) ** 2) <= entity.radius);
            if (index !== -1) {
                this.entities.splice(index, 1);
                this.removeSound.play();
                this.score += 5;
                this.createExplosion(x, y, 20);
            }
            else {
                this.addEntity(x, y);
                this.popSound.play();
                this.createFlash();
                this.score += 1;
            }
        }
        /*
         * Factory-Like Behavior (Creational)
         * `addEntity()` randomly creates a new shape (circle, square, triangle)
         * Encapsulates object creation for easier extension
         */
        addEntity(x, y) {
            const shapeTypes = [Entity_1.CircleEntity, Entity_1.SquareEntity, Entity_1.TriangleEntity];
            const ShapeClass = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            const radius = 20; // Default radius for all shapes
            const name = ShapeClass.name; // Name based on the shape class
            this.entities.push(new ShapeClass(name, x, y, radius, this.getRandomColor()));
        }
        getRandomColor() {
            const letters = "0123456789ABCDEF";
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        /*
         * Explosion Effect
         * When object is removed, small particles explode outward
         */
        createExplosion(x, y, radius) {
            for (let i = 0; i < 10; i++) {
                let angle = Math.random() * Math.PI * 2;
                let speed = Math.random() * 3;
                let particleX = x + Math.cos(angle) * radius;
                let particleY = y + Math.sin(angle) * radius;
                this.ctx.beginPath();
                this.ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = "rgba(255, 69, 0, 1)";
                this.ctx.fill();
            }
        }
        /*
         * Flash Effect
         * When a new object is added, the screen flashes slightly
         */
        createFlash() {
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    exports.default = Game;
});
define("index", ["require", "exports", "Game"], function (require, exports, Game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
     * Singleton Pattern (Creational)
     * `Game.getInstance()` ensures only one instance of the game exists
     */
    const game = Game_1.default.getInstance();
    game.start();
});
//# sourceMappingURL=index.js.map