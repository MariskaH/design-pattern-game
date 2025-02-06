import Loop from "./Loop";
import Mouse from "./Mouse";
import { CircleEntity, SquareEntity, TriangleEntity } from "./Entity";

export default class Game
{
    private static instance: Game;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private loop: Loop;
    private entities: (CircleEntity | SquareEntity | TriangleEntity)[] = [];
    private mouse: Mouse;
    private score: number = 0;
    private timer: number = 120;
    private isGameOver: boolean = false;
    private colorOffset = 0;
    private popSound = new Audio("assets/pop.mp3");
    private removeSound = new Audio("assets/remove.mp3");

    /*
     * Singleton Pattern (Creational)
     * Ensures only one instance of `Game.ts` exists.
     * Prevents multiple games running at the same time.
     */
    private constructor()
    {
        this.canvas = document.getElementById("game") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;

        if (!this.canvas || !this.ctx)
        {
            throw new Error("Canvas element or context could not be initialized");
        }

        // Set fixed canvas size
        this.canvas.width = 512;
        this.canvas.height = 512;

        // Facade Pattern (Structural)
        // `Game.ts` manages game logic (updates, rendering, input handling)
        // Other classes (`Loop.ts`, `Mouse.ts`, `Entity.ts`) do not need to control game flow
        this.loop = new Loop(this);
        this.mouse = new Mouse(this.canvas);
        this.mouse.onClick((x, y) => this.handleMouseClick(x, y));

        // Start game loop
        this.loop.start();

        // Progressive Difficulty
        // Every 30 seconds, objects move faster
        setInterval(() =>
        {
            if (!this.isGameOver && this.timer > 0)
            {
                this.timer--;
                if (this.timer % 30 === 0)
                {
                    this.entities.forEach(entity =>
                    {
                        entity.increaseSpeed();
                    });
                }
            } else if (this.timer <= 0)
            {
                this.isGameOver = true;
            }
        }, 1000);
    }

    public static getInstance(): Game
    {
        if (!Game.instance)
        {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    public start()
    {
        this.loop.start();
    }

    /*
     * Composite Pattern (Structural)
     * `entities[]` stores multiple objects dynamically
     * Objects are updated, drawn, and deleted **as part of one structure**
     */
    public update()
    {
        if (this.isGameOver) return;
        this.entities.forEach(entity => entity.update(this.canvas.width, this.canvas.height));
    }

    /*
     * Template Method Pattern (Behavioral)
     * `update()` and `draw()` define the fixed execution orde every frame
     *  Step 1:Update all objects
     *  Step 2:Draw everything
     *  Step 3:Repeat every frame
     */
    public draw()
    {
        // Dynamic Background Animation
        this.colorOffset += 0.005;
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, `hsl(${ (this.colorOffset * 100) % 360 }, 100%, 50%)`);
        gradient.addColorStop(1, "#2C5364");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all entities
        this.entities.forEach(entity => entity.draw(this.ctx));

        // Display score and timer
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Score: ${ this.score }`, 10, 30);
        this.ctx.fillText(`Time Left: ${ this.timer }s`, 10, 60);

        if (this.isGameOver)
        {
            this.ctx.fillStyle = "red";
            this.ctx.font = "40px Arial";
            this.ctx.fillText("Game Over!", this.canvas.width / 2 - 100, this.canvas.height / 2);
            this.ctx.fillText(`Final Score: ${ this.score }`, this.canvas.width / 2 - 120, this.canvas.height / 2 + 50);
        }
    }

    /*
     * Observer Pattern (Behavioral)
     * `Mouse.ts` detects clicks and **notifies `Game.ts`
     * `Game.ts` reacts dynamically (removing or adding objects)
     */
    private handleMouseClick(x: number, y: number)
    {
        if (this.isGameOver) return;

        // Check if an object was clicked
        const index = this.entities.findIndex(entity =>
            Math.sqrt((x - entity.x) ** 2 + (y - entity.y) ** 2) <= entity.radius
        );

        if (index !== -1)
        {
            this.entities.splice(index, 1);
            this.removeSound.play();
            this.score += 5;
            this.createExplosion(x, y, 20);
        } else
        {
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
    private addEntity(x: number, y: number)
    {
        const shapeTypes = [CircleEntity, SquareEntity, TriangleEntity];
        const ShapeClass = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const radius = 20; // Default radius for all shapes
        const name = ShapeClass.name; // Name based on the shape class
        this.entities.push(new ShapeClass(name, x, y, radius, this.getRandomColor()));
    }


    private getRandomColor(): string
    {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++)
        {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /*
     * Explosion Effect
     * When object is removed, small particles explode outward
     */
    private createExplosion(x: number, y: number, radius: number)
    {
        for (let i = 0; i < 10; i++)
        {
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
    private createFlash()
    {
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
