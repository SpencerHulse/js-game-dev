// enum defines a set of names constants
export const states = {
  STANDING_LEFT: 0,
  STANDING_RIGHT: 1,
  SITTING_LEFT: 2,
  SITTING_RIGHT: 3,
  RUNNING_LEFT: 4,
  RUNNING_RIGHT: 5,
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
    if (input === "PRESS right") this.player.setState(states.RUNNING_RIGHT);
    else if (input === "PRESS left") this.player.setState(states.RUNNING_LEFT);
    else if (input === "PRESS down") this.player.setState(states.SITTING_LEFT);
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
    if (input === "PRESS left") this.player.setState(states.RUNNING_LEFT);
    else if (input === "PRESS right")
      this.player.setState(states.RUNNING_RIGHT);
    else if (input === "PRESS down") this.player.setState(states.SITTING_RIGHT);
  }
}

export class SittingLeft extends State {
  constructor(player) {
    super("SITTING LEFT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 9;
  }
  handleInput(input) {
    if (input === "PRESS right") this.player.setState(states.SITTING_RIGHT);
    else if (input === "RELEASE down")
      this.player.setState(states.STANDING_LEFT);
  }
}

export class SittingRight extends State {
  constructor(player) {
    super("SITTING RIGHT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 8;
  }
  handleInput(input) {
    if (input === "PRESS left") this.player.setState(states.SITTING_LEFT);
    else if (input === "RELEASE down")
      this.player.setState(states.STANDING_RIGHT);
  }
}

export class RunningLeft extends State {
  constructor(player) {
    super("RUNNING LEFT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 7;
  }
  handleInput(input) {
    if (input === "PRESS right") this.player.setState(states.RUNNING_RIGHT);
    else if (input === "RELEASE left")
      this.player.setState(states.STANDING_LEFT);
    else if (input === "PRESS down") this.player.setState(states.SITTING_LEFT);
  }
}

export class RunningRight extends State {
  constructor(player) {
    super("RUNNING RIGHT");
    this.player = player;
  }
  enter() {
    this.player.frameY = 6;
  }
  handleInput(input) {
    if (input === "PRESS left") this.player.setState(states.RUNNING_LEFT);
    else if (input === "RELEASE right")
      this.player.setState(states.STANDING_RIGHT);
    else if (input === "PRESS down") this.player.setState(states.SITTING_RIGHT);
  }
}
