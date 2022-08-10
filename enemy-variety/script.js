// Ensures all images are loaded before the animations begins
window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 800;

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 1000;
      this.enemyTimer = 0;
      this.enemyTypes = ["worm", "ghost"];
    }
    update(deltaTime) {
      this.enemies = this.enemies.filter((object) => !object.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((object) => object.update(deltaTime));
    }
    draw() {
      this.enemies.forEach((object) => object.draw(this.ctx));
    }
    // Hash means private, so it can only be called inside the class
    #addNewEnemy() {
      const randomEnemy =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      // Passing this passes everything from the class
      if (randomEnemy === "worm") this.enemies.push(new Worm(this));
      else if (randomEnemy === "ghost") this.enemies.push(new Ghost(this));
      this.enemies.sort((a, b) => {
        // Worms at the top of the screen are drawn first
        return a.y - b.y;
      });
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markedForDeletion = false;
    }
    update(deltaTime) {
      this.x -= this.vx * deltaTime;
      if (this.x < 0 - this.width) this.markedForDeletion = true;
    }
    draw(ctx) {
      ctx.drawImage(
        this.image,
        0,
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

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      // Directly accessing the image with the id worm from the HTML
      this.image = worm;
      // Horizontal (x) Velocity
      this.vx = Math.random() * 0.1 + 0.1;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      // Only takes up the top 60% of the screen
      this.y = Math.random() * (this.game.height * 0.6);
      // Directly accessing the image with the id worm from the HTML
      this.image = ghost;
      // Horizontal (x) Velocity
      this.vx = Math.random() * 0.2 + 0.1;
      this.angle = 0;
    }
    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle);
    }
    draw() {
      // Extra exclusive to ghost
      ctx.save();
      ctx.globalAlpha = 0.7;
      // Brings in the draw from Enemy instead of overwriting it
      super.draw(ctx);
      ctx.restore();
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);
  let lastTime = 1;
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
  }
  animate(0);
});
