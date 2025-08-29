import {Injectable} from "@angular/core";
import {GAME_HEIGHT, GAME_WIDTH, OBJECTS_TYPES} from "../constants/constants";
import {ObjectsItems, Platform} from "../models/common";

export interface GameLevel {
  backgroundImage: any;
  platforms: Platform[];
  objectsItems: ObjectsItems[];

  getLevelData(): any; // Метод для получения данных уровня
  // update(deltaTime: number): void; // Метод для обновления логики уровня
  drawBackground(context: CanvasRenderingContext2D): void;

  drawPlatforms(context: CanvasRenderingContext2D): void;
  drawComputer(context: CanvasRenderingContext2D, touched?: boolean): void;
}

@Injectable({
  providedIn: "root"
})

export class Level implements GameLevel {
  levelNumber: number;
  backgroundImage: any;
  readonly width: number = GAME_WIDTH;
  readonly height: number = GAME_HEIGHT;
  platforms: Platform[] = [{x: 500, y: 490, width: 250, height: 55}, {
    x: 200, y: 300, width: 350, height: 55
  }];

  objectsItems: ObjectsItems[] = [{
    x: 220, y: 173, width: 140, height: 140, type: OBJECTS_TYPES.COMPUTER
  }];

  constructor() {
    this.setBackgroundImage();
    this.levelNumber = 1;
  }

  getLevelData(): any {
    return {level: this.levelNumber,};
  }

  // update(deltaTime: number): void {
  //   // Базовая логика обновления
  // }

  setBackgroundImage(backgroundImage?: string) {
    this.backgroundImage = new Image();
    this.backgroundImage.src = backgroundImage ? backgroundImage : "assets/background.png";
  }

  drawPlatforms(context: CanvasRenderingContext2D) {
    let platformImage = new Image();
    platformImage.src = "assets/platforms_1.png";
    let objectImage = new Image();
    objectImage.src = "assets/computer.png";
    for (let platform of this.platforms) {
      context.drawImage(platformImage, 0, 0, 147, 79, platform.x, platform.y, platform.width, platform.height)
    }
  }

  drawComputer(context: CanvasRenderingContext2D, touched?: boolean) {
    let objectImage = new Image();
    objectImage.src = touched ? "assets/computer_with_arrow.png" : "assets/computer.png";
    for (let object of this.objectsItems) {
      context.drawImage(objectImage, 0, 0, 288, 288, object.x, object.y, object.width, object.height)
    }
  }

  drawBackground(context: CanvasRenderingContext2D) {
    context.globalAlpha = 0.6
    context.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
  }
}
