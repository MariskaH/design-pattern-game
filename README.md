Design Pattern Game

About the Game

This is a simple game made using TypeScript and HTML5 Canvas. The game has moving shapes (circles, squares, and triangles) that the player can interact with by clicking. The goal is to earn points by clicking on shapes while they move around.

Features

Shapes move around randomly on the screen.

Click a shape to remove it and get points.

Click on empty space to add new shapes.

Shapes get faster every 30 seconds.

The game runs for 2 minutes before ending.

Design Patterns Used

This game follows the software design patterns:

1. Creational Patterns (Making Objects)

Singleton Pattern: The game has only one instance running at a time (Game.ts).

Factory-Like Pattern: The game randomly picks a shape (circle, square, or triangle) and creates it dynamically (Game.ts).

2. Structural Patterns (Organizing Code)

Facade Pattern: Game.ts handles the main game logic while other files (Loop.ts, Mouse.ts, Entity.ts) take care of smaller tasks like user input and animation.

Composite Pattern: The game stores multiple shapes in an array and treats them as one group for updates and drawing.

3. Behavioral Patterns (How Objects Behave)

Template Method Pattern: The game follows a fixed update-and-draw cycle every frame (Game.ts, Loop.ts, Entity.ts).

Observer Pattern: The Mouse.ts file listens for clicks and informs the game when a click happens.

Technology Used

TypeScript for better coding structure.

HTML5 Canvas API for drawing shapes.

RequireJS to manage script files.

CSS for styling.

How to Play

Open index.html in a web browser.

Click on shapes to remove them and earn points.

Click on an empty area to add new shapes.

The game gets harder over time as shapes move faster.

Try to get the highest score before time runs out!

How to Run the Game

Download or clone the repository.

Open the project folder.

Double-click index.html to open it in a browser.

Project Structure

📂 design-pattern-game
├── 📂 src
│ ├── Game.ts # Main game logic
│ ├── Entity.ts # Shapes (circle, square, triangle)
│ ├── Loop.ts # Game loop
│ ├── Mouse.ts # Handles mouse clicks
│ ├── index.ts # Starts the game
├── 📂 dist # Compiled JavaScript files
├── index.html # Game screen
├── style.css # Game styling
└── README.md # Project info

Who Made This?

I worked on this project alone as a way to learn about design patterns through this simple game.

License

This project is free to use under the MIT License.
