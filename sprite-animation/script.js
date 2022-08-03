const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();
playerImage.src = "./assets/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;
let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const staggerFrames = 5;

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // ctx.fillRect(100, 50, 100, 100);
  // The below nine argument version of drawImage cuts out a section of the source and then places it.
  // ctx.drawImage(image, srcX, srcY, srcW, srcH, destX, destY, destW, destH)
  // There are also two and four argument versions.
  ctx.drawImage(
    playerImage, // sprite sheet
    frameX * spriteWidth, // row on sprite sheet
    frameY * spriteHeight, // column on sprite sheet
    spriteWidth, // width of section taken from sprite sheet
    spriteHeight, // height of section taken from sprite sheet
    0,
    0,
    spriteWidth,
    spriteHeight
  );

  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
