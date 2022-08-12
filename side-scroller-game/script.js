window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1200;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;

  // Apply event listeners to keyboard events and hold an array of active keys
  class InputHandler {
    constructor() {
      this.keys = [];
      this.touchY = "";
      // Pixels at beginning and end of touch point must be at least this number to active event
      this.touchThreshold = 30;
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
        } else if (e.key === "Enter" && gameOver) {
          restartGame();
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
      window.addEventListener("touchstart", (e) => {
        this.touchY = e.changedTouches[0].pageY;
      });
      window.addEventListener("touchmove", (e) => {
        const swipeDistance = e.changedTouches[0].pageY - this.touchY;
        if (
          swipeDistance < -this.touchThreshold &&
          this.keys.indexOf("swipe up") === -1
        ) {
          this.keys.push("swipe up");
        } else if (
          swipeDistance > this.touchThreshold &&
          this.keys.indexOf("swipe down") === -1
        ) {
          this.keys.push("swipe down");
          if (gameOver) restartGame();
        }
      });
      window.addEventListener("touchend", (e) => {
        this.keys.splice(this.keys.indexOf("swipe up"), 1);
        this.keys.splice(this.keys.indexOf("swipe down"), 1);
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
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.image = playerImage;
      this.frameX = 0;
      this.maxFrame = 8;
      this.frameY = 0;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }
    restart() {
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 8;
      this.frameY = 0;
    }
    draw(context) {
      /* Hitbox examples      
      // Rectangle hitbox
      context.strokeStyle = "white";
      context.strokeRect(this.x, this.y, this.width, this.height);
      // Circle hitbox
      context.beginPath();
      context.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        0,
        Math.PI * 2
      );
      context.stroke(); */
      // Sprite
      context.drawImage(
        this.image,
        this.width * this.frameX,
        this.height * this.frameY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input, deltaTime, enemies) {
      // Collision detection
      enemies.forEach((enemy) => {
        // Distance between center points of the two circles (adjusted for accuracy)
        const dx = enemy.x + enemy.width / 2 - 20 - (this.x + this.width / 2);
        const dy = enemy.y + enemy.height / 2 - (this.y + this.height / 2 + 20);
        // Pythagorean Theorem
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Then compare the distance with the radius of circles 1 and 2 to detect collision
        if (distance < enemy.width / 3 + this.width / 3) {
          gameOver = true;
        }
      });
      // Sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      // Controls
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
      } else if (
        (input.keys.indexOf("ArrowUp") > -1 ||
          input.keys.indexOf("swipe up") > -1) &&
        this.onGround()
      ) {
        this.vy -= 32;
      } else {
        this.speed = 0;
      }
      // Horizontal movement
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;
      // Vertical Movement
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }
      // Boundary stops the potential of going through the floor
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;
    }
    onGround() {
      // Returns true or false for whether the player is on the ground
      return this.y >= this.gameHeight - this.height;
    }
  }

  // Handles endlessly scrolling background
  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = backgroundImage;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 10;
    }
    restart() {
      this.x = 0;
    }
    draw(context) {
      // Two images, with the second coming right after the 1st
      // When you reach the second image, it resets, giving the illusion of an endless map
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      // Account for width and the speed to ensure no gaps exist
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
  }

  // Generates enemies
  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = enemyImage;
      // Puts the image right off screen to the right
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      // 1000 milliseconds / fps
      this.frameInterval = 1000 / this.fps;
      this.speed = 8;
      this.markedForDeletion = false;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.width * this.frameX,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(deltaTime) {
      // Sprite animation speed
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      // Horizontal movement speed
      this.x -= this.speed;
      // Deletion
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
        score++;
      }
    }
  }

  // Responsible for the multiple enemies in the game - adding, updating, and removing
  function handleEnemies(deltaTime) {
    // Enemy spawn logic
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    // Draws and updates
    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    // Filter enemies marked for deletion
    enemies = enemies.filter((enemy) => enemy.markedForDeletion === false);
  }

  // Handles things like displaying score and game over message
  function displayStatusText(context, score) {
    context.textAlign = "left";
    context.font = "40px Helvetica";
    // Manual shadow since Firefox does not work well with built-in shadow property
    context.fillStyle = "black";
    context.fillText("Score: " + score, 20, 50);
    context.fillStyle = "white";
    context.fillText("Score: " + score, 22, 52);
    if (gameOver) {
      context.textAlign = "center";
      context.fillStyle = "black";
      context.fillText(
        "GAME OVER, press Enter or swipe down to try again!",
        canvas.width / 2,
        200
      );
      context.fillStyle = "white";
      context.fillText(
        "GAME OVER, press Enter or swipe down to try again!",
        canvas.width / 2 + 2,
        202
      );
    }
  }

  function restartGame() {
    player.restart();
    background.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch((err) => {
        alert(`Error, can't enable fullscreen mode: ${err.message}`);
      });
    } else {
      canvas.exitFullscreen();
    }
  }
  fullScreenButton.addEventListener("click", () => toggleFullscreen());

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  // Takes care of endlessly animating the game
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    // background.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx, score);
    if (!gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});
