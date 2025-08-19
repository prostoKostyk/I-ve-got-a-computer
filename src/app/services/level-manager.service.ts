// level-manager.service.ts
import { Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {LevelSecond} from "./levelSecond";
import {GameLevel, Level} from "./level";

export const CURRENT_LEVEL = new InjectionToken<GameLevel>('current.level');

@Injectable({
  providedIn: 'root'
})
export class LevelManagerService {
  currentLevelSubject = new BehaviorSubject<GameLevel>(new Level()); // Начинаем с первого уровня
  currentLevel$ = this.currentLevelSubject.asObservable();

  setCurrentLevel(levelNumber: number) {
    // Логика выбора уровня (можно подгружать динамически)
    switch (levelNumber) {
      case 1:
        this.currentLevelSubject.next(new Level());
        break;
      case 2:
        this.currentLevelSubject.next(new LevelSecond());
        break;
      default:
        console.warn(`Level ${levelNumber} not found, fallback to Level 1`);
        this.currentLevelSubject.next(new Level());
        break;
    }
  }
}
