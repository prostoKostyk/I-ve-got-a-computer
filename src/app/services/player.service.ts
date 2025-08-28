import {Inject, Injectable, OnDestroy} from "@angular/core";
import {APP_CONDITION, GAME_HEIGHT, GAME_WIDTH, KEYS, OBJECTS_TYPES, PlayerStates} from "../constants/constants";
import {FallingState, JumpingState, RunningState, StandingState, State} from "./player-states";
import {ObjectsItems} from "../models/common";
import {GameLevel} from "./level";
import {CURRENT_LEVEL, LevelManagerService} from "./level-manager.service";
import {Observable, Subscription} from "rxjs";

@Injectable({
  providedIn: "root"
})

export class PlayerService implements OnDestroy {
  width: number = 86;
  height: number = 128;
  x: number = 0;
  y: number = 130;
  frameX: number = 0;
  frameY: number = 0;
  vy: number = 0;
  weight: number = 1;
  mirror: boolean;
  levelData: any;
  collisionObject: ObjectsItems | null;
  context: CanvasRenderingContext2D;
  computerTouched: boolean;
  private readonly _gameWidth: number = GAME_WIDTH;
  private readonly _gameHeight: number = GAME_HEIGHT;
  private readonly states: State[];
  private readonly fps: number = 10;
  private readonly frameInterval: number = 0;
  private numberOfFrames: number = 1;
  private speed: number = 0;
  private maxSpeed: number = 6;
  private currentState: State;
  private frameTimer: number = 0;
  private levelSubscription: Subscription;
  private currentLevel: GameLevel;

  constructor(@Inject(CURRENT_LEVEL) private currentLevel$: Observable<GameLevel>, private levelManager: LevelManagerService) {
    this.states = [new StandingState(this), new RunningState(this), new JumpingState(this), new FallingState(this)];
    this.y = this._gameHeight - this.height;
    this.frameInterval = 1000 / this.fps;
    this.trySetStandingState();
    this.levelSubscription = this.currentLevel$.subscribe(level => {
      this.currentLevel = level;
    });
  }

  ngOnDestroy() {
    this.levelSubscription.unsubscribe();
  }

  isOnGround(): Boolean {
    return this.y >= this._gameHeight - this.height;
  }

  update(pressedKeys: string[], deltaTime: number) {
    this.currentState.handleInput(pressedKeys);
    this.handleHorizontalMoving(pressedKeys);
    this.handleVerticalMoving(pressedKeys);
    if (this.numberOfFrames > 1) {
      if (this.frameTimer > this.frameInterval) {
        this.frameTimer = 0;
        this.frameX < this.numberOfFrames ? this.frameX++ : this.frameX = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
  }

  setFrames(frameX: number, frameY: number, numberOfFrames: number) {
    this.frameX = frameX;
    this.frameY = frameY;
    this.numberOfFrames = numberOfFrames;
  }

  setState(stateNumber: number) {
    this.currentState = this.states[stateNumber];
    this.currentState.enter();
  }

  trySetStandingState() {
    (this.isOnGround() || this.checkPlatformCollision()) && this.setState(PlayerStates.STANDING);
  }

  checkPlatformCollision() {
    for (const platform of this.currentLevel.platforms) {
      const isAbovePlatform = this.y + this.height <= platform.y && // персонаж выше платформы
        this.y + this.height + this.vy >= platform.y; // следующий шаг будет ниже или на уровне платформы

      const isWithinXBounds = this.x + this.width/2.5 > platform.x && this.x + this.width/2 < platform.x + platform.width;

      if (isAbovePlatform && isWithinXBounds) {
        // Персонаж "приземляется" на платформу
        this.y = platform.y - this.height;
        this.vy = 0;
        return true; // стоит на платформе
      }
    }
    return false; // не стоит на платформе
  }

  private checkObjectCollision() {
    for (const object of this.currentLevel.objectsItems) {
      const isYCollision = this.y >= object.y - object.height && this.y - this.height < object.y;
      const isXCollision = this.x + this.width - 20 > object.x && this.x < object.x + object.width/2;
      if(isXCollision && isYCollision) {
        this.computerTouched = true;
        this.collisionObject = object;
        return;
      }
      this.computerTouched = false;
    }
    this.collisionObject = null;
  }

  useObject() {
    if (this.collisionObject?.type === OBJECTS_TYPES.COMPUTER) {
      localStorage.setItem("c", APP_CONDITION.COMPUTER_OPENED);
    }
  }

  nextLevel() {
    this.levelManager.setCurrentLevel(2); // Переключаемся на второй уровень (пример)
    this.levelData = this.currentLevel.getLevelData();
  }

  previousLevel() {
    this.levelManager.setCurrentLevel(1); // Переключаемся на второй уровень (пример)
    this.levelData = this.currentLevel.getLevelData();
  }

  private handleHorizontalMoving(pressedKeys: string[]) {
    if (pressedKeys.includes(KEYS.ARROW_RIGHT)) {
      this.speed = this.maxSpeed;
    } else if (pressedKeys.includes(KEYS.ARROW_LEFT)) {
      this.speed = -this.maxSpeed;
    } else {
      this.speed = 0;
      return;
    }
    this.x += this.speed;
    if (this.x < 0) {
      if (this.levelData?.level > 1) {
        this.previousLevel();
        this.x = 800;
      } else {
        this.x = 0;
      }
    }
    // ?
    if (this.x > this._gameWidth - this.width) this.x = this._gameWidth - this.width;
    if (this.x > 800) {
      this.nextLevel();
      this.x = 0;
    }
    this.checkObjectCollision();
  }

  private handleVerticalMoving(pressedKeys: string[]) {
    this.y += this.vy;
    // Гравитация и столкновение с платформами
    if (!this.isOnGround()) {
      this.vy += this.weight;
      const onPlatform = this.checkPlatformCollision();
      if (onPlatform) {
        // Останавливаем падение
        this.vy = 0;
      }
    } else {
      // Персонаж на земле
      this.vy = 0;
      this.y = this._gameHeight - this.height;
    }
  }
}
