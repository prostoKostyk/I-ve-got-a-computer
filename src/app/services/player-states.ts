import {KEYS, PlayerStates} from "../constants/constants";
import {PlayerService} from "./player.service";
import {Level} from "./level";

export class State {
  state: PlayerStates;

  constructor(state: PlayerStates) {
    this.state = state;
  }

  enter() {
    // console.log("State enter");
  }

  handleInput(pressedKeys: string[]) {
    // console.log("State handleInput");
  }
}

export class StandingState extends State {
  constructor(private playerService: PlayerService) {
    super(PlayerStates.STANDING);
  }

  override enter() {
    this.playerService.setFrames(0, 2, 1);
  }

  override handleInput(pressedKeys: string[]) {
    if (pressedKeys.includes(KEYS.ARROW_RIGHT) || pressedKeys.includes(KEYS.ARROW_LEFT)) {
      this.playerService.setState(PlayerStates.RUNNING);
    }
    else if (pressedKeys.includes(KEYS.ARROW_UP)) {
      if (this.playerService.collisionObject) {
        this.playerService.useObject();
        return;
      }
      this.playerService.setState(PlayerStates.JUMPING);
    }
    if (pressedKeys.includes(KEYS.ARROW_DOWN) && this.playerService.checkPlatformCollision()) {
      this.playerService.y += 5;
      this.playerService.vy = 1;
      this.playerService.setState(PlayerStates.FALLING);
    }
  }
}

export class RunningState extends State {
  constructor(private playerService: PlayerService) {
    super(PlayerStates.RUNNING);
  }

  override enter() {
    this.playerService.setFrames(0, 0, 6);
  }

  override handleInput(pressedKeys: string[]) {
    if (pressedKeys.includes(KEYS.ARROW_DOWN)) {
      this.playerService.setState(PlayerStates.STANDING);
    }
    else if (pressedKeys.includes(KEYS.ARROW_UP)) {
      if (this.playerService.collisionObject) {
        this.playerService.useObject();
        return;
      }
      this.playerService.setState(PlayerStates.JUMPING);
    }
    if (pressedKeys.includes(KEYS.ARROW_DOWN) && this.playerService.checkPlatformCollision()) {
      this.playerService.y += 5;
      this.playerService.vy = 1;
      this.playerService.setState(PlayerStates.FALLING);
    }
  }
}

export class JumpingState extends State {
  constructor(private playerService: PlayerService) {
    super(PlayerStates.JUMPING);
  }

  override enter() {
    this.playerService.setFrames(0, 1, 1);
    if (this.playerService.isOnGround() || this.playerService.checkPlatformCollision()) {
      this.playerService.vy -= 20;
    }
  }

  override handleInput(pressedKeys: string[]) {
    if (this.playerService.vy > this.playerService.weight) {
      this.playerService.setState(PlayerStates.FALLING);
    }
  }
}

export class FallingState extends State {
  constructor(private playerService: PlayerService) {
    super(PlayerStates.FALLING);
  }

  override enter() {
    this.playerService.setFrames(1, 1, 1);
  }

  override handleInput(pressedKeys: string[]) {
    if (this.playerService.isOnGround()) {
      this.playerService.setState(PlayerStates.STANDING);
    }
    if (this.playerService.checkPlatformCollision()) {
      this.playerService.setState(PlayerStates.STANDING);
    }
  }
}

