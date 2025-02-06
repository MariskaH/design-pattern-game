Design Pattern Game

About the Game

This is a simple game made using TypeScript and HTML5 Canvas. The game has moving shapes (circles, squares, and triangles) that the player can interact with by clicking. The goal is to earn points by clicking on shapes while they move around.


Features

✔ Shapes move randomly on the screen.
✔ Click a shape to remove it and earn points.
✔ Click on an empty space to add new shapes.
✔ Shapes get faster every 30 seconds.
✔ The game runs for 2 minutes before ending.


Design Patterns Used

This game follows several software design patterns:

1. Creational Patterns (Making Objects)

Singleton Pattern → Ensures the game has only one instance running (Game.ts).

Factory-Like Pattern → Randomly creates a shape (CircleEntity, SquareEntity, TriangleEntity) dynamically (Game.ts).


2. Structural Patterns (Organizing Code)

Facade Pattern → Game.ts handles the main game logic, while smaller files (Loop.ts, Mouse.ts, Entity.ts) handle specific tasks like animation and input.

Composite Pattern → Stores multiple shapes in an array and treats them as one unit for updating and drawing.


3. Behavioral Patterns (How Objects Behave)

Template Method Pattern → The game follows a fixed update-and-draw cycle every frame (Game.ts, Loop.ts, Entity.ts).

Observer Pattern → Mouse.ts detects mouse clicks and notifies Game.ts when an interaction happens.


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


Who Made This?
I worked on this project alone as a way to learn about design patterns through this simple game.

License
This project is free to use under the MIT License.
