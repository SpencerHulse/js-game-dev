// tells it that this is a canvas project for code suggestions
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);
const numberOfEnemies = 100;
const enemiesArray = [];

class Enemy {
  constructor() {
    // The use of Math.random() has the enemies appear at random places
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.width = 100;
    this.height = 100;
  }
  // Update coordinates for movement
  update() {
    this.x++;
    this.y++;
  }
  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// const enemy1 = new Enemy();
for (let i = 0; i < numberOfEnemies; i++) {}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemy1.update();
  // Creates a rectangle with the enemy's parameters
  enemy1.draw();
  requestAnimationFrame(animate);
}
animate();
