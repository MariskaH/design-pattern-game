/*
 * Composite Pattern (Structural)
 * `Game.ts` stores multiple `Entity` objects in `entities[]`
 * Each object updates independently but is part of one list
 */

export class Entity
{
    public radius: number;
    protected dx: number;
    protected dy: number;

    constructor(
        public name: string,
        public x: number,
        public y: number,
        radius: number,
        public color: string
    )
    {
        this.radius = radius;
        this.dx = Math.random() * 4 - 2; // Random speed
        this.dy = Math.random() * 4 - 2;
    }

    /*
     * Template Method Pattern (Behavioral)
     * `update()` method ensures objects always move and bounce off walls
     * The structure is fixed, but behavior can be changed per shape
     */
    update(canvasWidth: number, canvasHeight: number)
    {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x - this.radius <= 0 || this.x + this.radius >= canvasWidth) this.dx *= -1;
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvasHeight) this.dy *= -1;
    }

    draw(ctx: CanvasRenderingContext2D) { }

    /*
     * Dynamic Difficulty Scaling
     * Called in `Game.ts` every 30 seconds to make game harder
     */
    increaseSpeed()
    {
        this.dx *= 1.1;
        this.dy *= 1.1;
    }
}

/*
 * Factory-Like Behavior (Creational)
 * `Game.ts` randomly picks one of these classes when spawning objects
 */
export class CircleEntity extends Entity
{
    draw(ctx: CanvasRenderingContext2D)
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

export class SquareEntity extends Entity
{
    draw(ctx: CanvasRenderingContext2D)
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}

export class TriangleEntity extends Entity
{
    draw(ctx: CanvasRenderingContext2D)
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.radius);
        ctx.lineTo(this.x - this.radius, this.y + this.radius);
        ctx.lineTo(this.x + this.radius, this.y + this.radius);
        ctx.closePath();
        ctx.fill();
    }
}
