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
  class Player {}

  // Handles endlessly scrolling background
  class Background {}

  // Generates enemies
  class Enemy {}

  // Responsible for the multiple enemies in the game - adding, updating, and removing
  function handleEnemies() {}

  // Handles things like displaying score and game over message
  function displayStatusText() {}

  const input = new InputHandler();

  // Takes care of endlessly animating the game
  function animate() {}
});
