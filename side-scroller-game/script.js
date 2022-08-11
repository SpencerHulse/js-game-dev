window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;

  // Apply event listeners to keyboard events and hold an array of active keys
  class InputHandler {
    constructor() {
      this.keys = [];
      // To inherit this, must use an arrow function or bind method
      window.addEventListener("keydown", (e) => {
        // If it is that key and that key is not in the keys array, push it
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        // Find and remove key from array when key released
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  // React to keys as they are pressed, drawing and updating the player
  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.spriteWidth = this.width;
      this.spriteHeight = this.height;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = playerImage;
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
    }
    draw(context) {
      context.fillStyle = "white";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.spriteWidth * this.frameX,
        this.spriteHeight * this.frameY,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input) {
      // Horizontal movement
      this.x += this.speed;
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
      } else {
        this.speed = 0;
      }
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;
    }
  }

  // Handles endlessly scrolling background
  class Background {}

  // Generates enemies
  class Enemy {}

  // Responsible for the multiple enemies in the game - adding, updating, and removing
  function handleEnemies() {}

  // Handles things like displaying score and game over message
  function displayStatusText() {}

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);

  // Takes care of endlessly animating the game
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    player.update(input);
    requestAnimationFrame(animate);
  }
  animate();
});
