const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
// Gets data relevant to the viewpoint (for offsetting click coords)
let canvasPosition = canvas.getBoundingClientRect();

const explosions = [];

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    // Multiplication is more performant that division
    this.width = this.spriteWidth * 0.7;
    this.height = this.spriteHeight * 0.7;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "./assets/boom.png";
    this.sound = new Audio();
    this.sound.src = "./assets/boom.wav";
    this.frame = 0;
    this.timer = 0;
    // Based on radian
    this.angle = Math.random() * 6.2;
  }
  update() {
    if (this.timer === 0) this.sound.play();
    this.timer++;
    if (this.timer % 10 === 0) this.frame++;
  }
  draw() {
    // Save, translate, rotate, and restore are all used for rotation
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0, // zero because only a single row
      this.spriteWidth,
      this.spriteHeight,
      // These would be this.x and this.y, but that has happened in translate
      0 - this.width * 0.5,
      0 - this.height * 0.5,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

window.addEventListener("click", (e) => {
  createAnimation(e);
});

function createAnimation(e) {
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;
  explosions.push(new Explosion(positionX, positionY));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();
    // Remove a single object at that instance (when the animations has run its course)
    if (explosions[i].frame > 5) {
      explosions.splice(i, 1);
      // Account for the removed object
      i--;
    }
  }
  requestAnimationFrame(animate);
}
animate();
