const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
};

class State {
  constructor(state) {
    this.state = state;
  }
}

export class Sitting extends State {
  constructor(player) {
    // Makes this.state in class State equal "SITTING"
    super("SITTING");
    this.player = player;
  }
  enter() {}
  handleInput(input) {}
}
