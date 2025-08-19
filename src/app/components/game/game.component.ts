import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from "@angular/core";
import {PlayerService} from "../../services/player.service";
import {GAME_HEIGHT, GAME_WIDTH, KEYS} from "../../constants/constants";
import {GameLevel, Level} from "../../services/level";
import {CURRENT_LEVEL} from "../../services/level-manager.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: "app-game", templateUrl: "./game.component.html", styleUrl: "./game.component.less"
})
export class GameComponent implements AfterViewInit, OnDestroy {
  @ViewChild("gameCanvas") canvas: ElementRef<HTMLCanvasElement>;
  lastTime: number = 0;
  private context: CanvasRenderingContext2D;
  private readonly width: number = GAME_WIDTH;
  private readonly height: number = GAME_HEIGHT;
  private pressedKeys: string[] = [];
  private availableKeys: string[] = Object.values(KEYS);
  private initialised: boolean;
  private levelSubscription: Subscription;
  private currentLevel: GameLevel;

  constructor(protected playerService: PlayerService, @Inject(CURRENT_LEVEL) private currentLevel$: Observable<GameLevel>,) {
  }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;
    // @ts-ignore
    this.context = this.canvas.nativeElement.getContext("2d");
    this.keyListen();
    this.levelSubscription = this.currentLevel$.subscribe(level => {
      this.currentLevel = level;
      this.currentLevel.backgroundImage.onload = () => {
        !this.initialised && this.animate(0, this.canvas, this.context, this.pressedKeys);
        this.initialised = true;
      };
    });
  }

  ngOnDestroy() {
    this.levelSubscription.unsubscribe();
  }

  draw() {
    let playerImage = new Image();
    playerImage.src = this.playerService.mirror ? "assets/player_without_sword_mirrored.png" : "assets/player_without_sword.png";
    // The x-axis coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context.
    const playerX = this.playerService.frameX * this.playerService.width;
    // The y-axis coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context.
    const playerY = this.playerService.frameY * this.playerService.height;
    this.currentLevel.drawBackground(this.context);
    this.context.globalAlpha = 1;
    this.context.drawImage(playerImage, playerX, playerY, this.playerService.width, this.playerService.height, this.playerService.x, this.playerService.y, this.playerService.width, this.playerService.height)
    this.currentLevel.drawPlatforms(this.context);
  }

  /**
   * Adds 2 addEventListener for keydown and keyup
   * On KeyDown adds current key to pressedKeys array and checks player direction
   * On KeyUp removes released button from pressedKeys array and set calls trySetStandingState to check whether it is necessary to set StandingState
   * Called in ngAfterViewInit
   */
  private keyListen() {
    window.addEventListener("keydown", e => {
      if (this.availableKeys.includes(e.key) && !this.pressedKeys.includes(e.key)) {
        this.pressedKeys.push(e.key);
        if (e.key === KEYS.ARROW_UP && this.playerService.computerOpened) {
          console.log(this.playerService.computerOpened)
          this.playerService.computerOpened = false;
        }
        this.checkPlayerDirection(e.key);
      }
    })

    window.addEventListener("keyup", e => {
      if (this.availableKeys.includes(e.key) && this.pressedKeys.includes(e.key)) {
        this.pressedKeys.splice(this.pressedKeys.indexOf(e.key), 1);
        this.playerService.trySetStandingState();
      }
    })
  }

  /**
   * Checks horizontal player direction to set  this.playerService.mirror value to set mirrored or not mirrored picture in draw() method
   * Called in addEventListener("keydown")
   * @param {string} key - Current pressed button
   */
  private checkPlayerDirection(key: string) {
    if (key === KEYS.ARROW_LEFT) {
      this.playerService.mirror = true;
    } else if (key === KEYS.ARROW_RIGHT) {
      this.playerService.mirror = false;
    }
  }

  private animate(timeStamp: number, canvas: ElementRef<HTMLCanvasElement>, context: CanvasRenderingContext2D, pressedKeys: string[]) {
    this.canvas = canvas;
    this.context = context;
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;

    context.clearRect(0, 0, this.width, this.height);
    this.playerService.update(pressedKeys, deltaTime);
    this.draw();
    window.requestAnimationFrame((_timeStamp) => this.animate(_timeStamp, canvas, context, pressedKeys));
  }
}
