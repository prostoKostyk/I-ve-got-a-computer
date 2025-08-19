import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {LoginComponent} from "./components/login/login.component";
import {GameComponent} from "./components/game/game.component";
import {NgOptimizedImage} from "@angular/common";
import {Level} from "./services/level";
import {LevelSecond} from "./services/levelSecond";
import {CURRENT_LEVEL, LevelManagerService} from "./services/level-manager.service";
import { ComputerComponent } from './components/computer/computer.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, GameComponent, ComputerComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, NgOptimizedImage,],
  providers: [{
    provide: CURRENT_LEVEL,
    useFactory: (levelManager: LevelManagerService) => levelManager.currentLevel$,
    deps: [LevelManagerService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
