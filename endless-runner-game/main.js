import { Player } from "./classes/Player.js";
import { Input } from "./classes/Input.js";
import { Background } from "./classes/Background.js";

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
      this.speed = 3; // Three pixels per frame
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new Input();
    }
    update(deltaTime) {
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
    }
    draw() {
      this.background.draw(ctx);
      this.player.draw(ctx);
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
    requestAnimationFrame(animate);
  }
  animate(0);
});
