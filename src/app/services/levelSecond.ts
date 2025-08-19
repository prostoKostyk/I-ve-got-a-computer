import {ElementRef, Injectable} from "@angular/core";
import {GAME_HEIGHT, GAME_WIDTH, KEYS, PlayerStates} from "../constants/constants";
import {Platform} from "../models/common";
import {Level} from "./level";

@Injectable({
  providedIn: "root"
})

export class LevelSecond extends Level {
  override platforms: Platform[] = [{x: 300, y: 300, width: 300, height: 20}];

  constructor() {
    super();
    this.levelNumber = 2;
    // console.log("this.levelNumber = 2")
  }

  override setBackgroundImage(backgroundImage?: string) {
    this.backgroundImage = new Image();
    this.backgroundImage.src = backgroundImage ? backgroundImage : "assets/backup/ChatGPT Image 21 июн. 2025 г., 15_10_44.png";
  }
}
