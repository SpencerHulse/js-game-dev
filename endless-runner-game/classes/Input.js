export class Input {
  constructor() {
    this.keys = [];
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
