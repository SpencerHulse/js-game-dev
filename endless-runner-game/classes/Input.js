export class Input {
  constructor(game) {
    this.keys = [];
    this.game = game;
    window.addEventListener("keydown", (e) => {
      const key = e.key;
      if (
        (key === "ArrowDown" ||
          key === "ArrowUp" ||
          key === "ArrowLeft" ||
          key === "ArrowRight" ||
          key === "Enter") &&
        this.keys.indexOf(key) === -1
      ) {
        this.keys.push(key);
      } else if (e.key === "d") {
        this.game.debug = !this.game.debug;
      }
    });
    window.addEventListener("keyup", (e) => {
      const key = e.key;
      if (
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "Enter"
      ) {
        this.keys.splice(this.keys.indexOf(key), 1);
      }
    });
  }
}
