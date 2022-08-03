const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();
playerImage.src = "./assets/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;
let gameFrame = 0;
const staggerFrames = 5;
const spriteAnimations = [];
const animationStates = [
  {
    name: "idle",
    frames: 7,
  },
  {
    name: "jump",
    frames: 7,
  },
  {
    name: "fall",
    frames: 9,
  },
  {
    name: "run",
    frames: 9,
  },
  {
    name: "dizzy",
    frames: 11,
  },
  {
    name: "sit",
    frames: 5,
  },
  {
    name: "roll",
    frames: 7,
  },
  {
    name: "bite",
    frames: 7,
  },
  {
    name: "ko",
    frames: 12,
  },
  {
    name: "damage",
    frames: 4,
  },
];
animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  };
  // Gets all the frames for animation rows
  for (let j = 0; j < state.frames; j++) {
    // j represents the column within the row
    let positionX = j * spriteWidth;
    // i represents the current row
    let positionY = index * spriteHeight;
    frames.loc.push({ x: positionX, y: positionY });
  }
  spriteAnimations[state.name] = frames;
});

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Only returns whole numbers, which works as the position in the sprite row.
  // The six represents the basic length of the first sprite rows.
  let position =
    Math.floor(gameFrame / staggerFrames) % spriteAnimations["idle"].loc.length;
  let frameX = spriteWidth * position;
  let frameY = spriteAnimations["idle"].loc[position].y;
  // The below nine argument version of drawImage cuts out a section of the source and then places it.
  // ctx.drawImage(image, srcX, srcY, srcW, srcH, destX, destY, destW, destH)
  // There are also two and four argument versions.
  ctx.drawImage(
    playerImage, // sprite sheet
    frameX, // row on sprite sheet
    frameY, // column on sprite sheet
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
