import { Player } from "./classes/Player.js";
import { Input } from "./classes/Input.js";
import { Background } from "./classes/Background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./classes/Enemies.js";
import { UI } from "./classes/UI.js";

window.addEventListener("load", () => {
  const canvas = canvas1;
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0; // Three pixels per frame
      this.maxSpeed = 3;
      // Currently, background is only manually changeable
      this.gameBackground = "forest";
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new Input(this);
      this.UI = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.maxParticles = 200;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.maxTime = 30000;
      this.score = 0;
      this.winningScore = (this.maxTime / 1000) * 0.5;
      this.fontColor = "black";
      this.time = 0;
      this.gameOver = false;
      this.lives = 5;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) this.gameOver = true;
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      // Handle Enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
      });
      // Handle Messages
      this.floatingMessages.forEach((message) => {
        message.update();
      });
      // Handle Particles
      this.particles.forEach((particle) => {
        particle.update();
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }
      // Handle Collisions
      this.collisions.forEach((collision) => {
        collision.update(deltaTime);
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      this.particles = this.particles.filter(
        (particle) => !particle.markedForDeletion
      );
      this.collisions = this.collisions.filter(
        (collision) => !collision.markedForDeletion
      );
      this.floatingMessages = this.floatingMessages.filter(
        (message) => !message.markedForDeletion
      );
    }
    draw() {
      this.background.draw(ctx);
      this.player.draw(ctx);
      this.enemies.forEach((enemy) => {
        enemy.draw(ctx);
      });
      this.floatingMessages.forEach((message) => {
        message.draw(ctx);
      });
      this.particles.forEach((particle) => {
        particle.draw(ctx);
      });
      this.collisions.forEach((collision) => {
        collision.draw(ctx);
      });
      this.UI.draw(ctx);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5)
        this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});
