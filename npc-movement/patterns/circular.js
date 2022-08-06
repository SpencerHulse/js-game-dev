// tells it that this is a canvas project for code suggestions
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);
const numberOfEnemies = 30;
const enemiesArray = [];

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "./assets/enemy3.png";
    // The minus allows some to go to the left and some to the right
    this.speed = Math.random() * 4 + 1;
    // Sprite sheet width / frames
    this.spriteWidth = 218;
    this.spriteHeight = 177;
    // Retains aspect ratio
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    // The use of Math.random() has the enemies appear at random places
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    // Gets a random number between 1 and 4 for flap speed
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    // Used for wavy movement
    this.angle = 0;
    this.angleSpeed = Math.random() * 2 + 0.5;
    this.curve = Math.random() * 200 + 50;
  }
  // Update coordinates for movement
  update() {
    this.x =
      Math.sin(this.angle * (Math.PI / 180)) * this.curve +
      (canvas.width / 2 - this.width / 2);
    this.y =
      Math.cos(this.angle * (Math.PI / 180)) * this.curve +
      (canvas.height / 2 - this.height / 2);
    this.angle += this.angleSpeed;
    // Gives the enemies endless movement by having them reappear after they go off screen
    if (this.x + this.width < 0) this.x = canvas.width;
    // Animate sprites - only every so many animation cycles by flap speed
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArray.push(new Enemy());
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemiesArray.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
