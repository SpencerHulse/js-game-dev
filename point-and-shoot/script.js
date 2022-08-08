const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;
let score = 0;
let gameOver = false;
ctx.font = "50px Impact";

// Counter
let timeToNextRaven = 0;
// Milliseconds per raven release
let ravenInterval = 500;
// Keeps track of previous time
let lastTime = 0;

let ravens = [];
class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    // Horizontal speed (basically)
    this.directionX = Math.random() * 5 + 3;
    // Up and down movement between -2.5 and 2.5
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = "./assets/raven.png";
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    // Flap speed determined, in part, by horizontal movement speed
    this.flapInterval = 400 / this.directionX;
    // Random color values for hit boxes on the second canvas
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      +this.randomColors[2] +
      ")";
    this.hasTrail = Math.random() > 0.5;
  }
  update(deltatime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    this.timeSinceFlap += deltatime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
      if (this.hasTrail)
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(this.x, this.y, this.width, this.color));
        }
    }
    if (this.x < 0 - this.width) gameOver = true;
  }
  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
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

let explosions = [];
class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "./assets/boom.png";
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "./assets/boom.wav";
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.markedForDeletion = false;
  }
  update(deltatime) {
    if (this.frame === 0) this.sound.play();
    this.timeSinceLastFrame += deltatime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.markedForDeletion = true;
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
      this.y - this.size * 0.25,
      this.size,
      this.size
    );
  }
}

let particles = [];
class Particle {
  constructor(x, y, size, color) {
    this.size = size;
    this.x = x + this.size / 2 + Math.random() * 50 - 25;
    this.y = y + this.size / 3;
    this.radius = Math.random() * (this.size / 10);
    this.maxRadius = Math.random() * 20 + 35;
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.color = color;
  }
  update() {
    this.x += this.speedX;
    this.radius += 0.5;
    // The subtraction of five stops the bug of particles when they grow larger than max radius
    // The bug: full opacity before deletion
    if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
  }
  draw() {
    // Save and restore makes the globalAlpha only work on the trail
    ctx.save();
    ctx.globalAlpha = 1 - this.radius / this.maxRadius;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawScore() {
  // The two versions provide a shadow effect
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 55, 80);
}

function drawGameOver() {
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(
    "GAME OVER, your score is " + score,
    canvas.width * 0.5,
    canvas.height * 0.5
  );
  ctx.fillStyle = "white";
  ctx.fillText(
    "GAME OVER, your score is " + score,
    canvas.width * 0.5 + 5,
    canvas.height * 0.5 + 5
  );
}

window.addEventListener("click", (e) => {
  // Gets data of the pixel clicked (x, y, width, height)
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  // Retrieve the color of what was clicked
  const pixelColor = detectPixelColor.data;
  ravens.forEach((raven) => {
    if (
      raven.randomColors[0] === pixelColor[0] &&
      raven.randomColors[1] === pixelColor[1] &&
      raven.randomColors[2] === pixelColor[2]
    ) {
      // Collision detected
      raven.markedForDeletion = true;
      score++;
      explosions.push(new Explosion(raven.x, raven.y, raven.width));
    }
  });
});

// Timestamp is automatically generated by JavaScript
function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  // Creates a new raven and resets the count
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    // Puts larger ravens to the front
    ravens.sort(function (a, b) {
      return a.width - b.width;
    });
  }
  // Before ravens to be behind them
  drawScore();
  // Array literal is used by only having an array
  // Particles come first so they are placed behind the ravens
  [...particles, ...ravens, ...explosions].forEach((object) =>
    object.update(deltatime)
  );
  [...particles, ...ravens, ...explosions].forEach((object) => object.draw());
  // Only keeps ravens that are not marked for deletion
  ravens = ravens.filter((object) => object.markedForDeletion === false);
  explosions = explosions.filter(
    (object) => object.markedForDeletion === false
  );
  particles = particles.filter((object) => object.markedForDeletion === false);
  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
}
// Without a starting timestamp value, it is NaN
animate(0);
