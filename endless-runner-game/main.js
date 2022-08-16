import { Player } from "./classes/Player.js";

window.addEventListener("load", () => {
  const canvas = canvas1;
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
    }
    update() {
      this.player.update();
    }
    draw() {
      this.player.draw(ctx);
    }
  }

  const game = new Game(canvas.width, canvas.height);
  console.log(game);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate();
});
