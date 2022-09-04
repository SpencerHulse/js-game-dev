export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
  }
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;
    context.font = this.fontSize + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;
    // Score
    context.fillText("Score: " + this.game.score, 20, 50);
    // Timer
    context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    context.fillText(
      "Time: " + Math.floor((this.game.maxTime - this.game.time) / 1000 + 1),
      20,
      80
    );
    // Game Over
    if (this.game.gameOver) {
      this.game.time = this.game.maxTime;
      context.textAlign = "center";
      context.font = this.fontSize * 2 + "px " + this.fontFamily;
      if (this.game.score > (this.game.maxTime / 1000) * 0.5) {
        context.fillText(
          "Nice!",
          this.game.width * 0.5,
          this.game.height * 0.5
        );
        context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        context.fillText(
          "You defeated the creatures of the night!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        context.fillText(
          "Love at first bite?",
          this.game.width * 0.5,
          this.game.height * 0.5
        );
        context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        context.fillText(
          "Nope. Better luck next time!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
    }
    context.restore();
  }
}
