// enum defines a set of names constants
export const states = {
  STANDING_LEFT: 0,
  STANDING_RIGHT: 1,
};

class State {
  constructor(state) {
    // Keeps track of currently active state
    this.state = state;
  }
}

export class StandingLeft extends State {
  constructor(player) {
    // Executes code in the parent (passes name of current state)
    // It makes this.state = "STANDING LEFT"
    super("STANDING LEFT");
    this.player = player;
  }
  // What needs to be done when the player enters this state
  enter() {
    this.player.frameY = 1;
  }
  // Listens for inputs and swaps to a different state when needed
  handleInput(input) {
    if (input === "PRESS right") this.player.setState(state.STANDING_RIGHT); //set state to StandingRight
  }
}

export class StandingRight extends State {
  constructor(player) {
    super("STANDING RIGHT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 0;
  }
  handleInput(input) {
    if (input === "PRESS left") this.player.setState(state.STANDING_LEFT); //set state to StandingLeft
  }
}
