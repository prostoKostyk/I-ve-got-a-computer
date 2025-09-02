import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "./components/login/login.component";
import {GameComponent} from "./components/game/game.component";
import {NgOptimizedImage} from "@angular/common";
import {CURRENT_LEVEL, LevelManagerService} from "./services/level-manager.service";
import {ComputerComponent} from "./components/computer/computer.component";
import {
  ArticleListComponentComponent
} from "./components/computer/articles/article-list-component/article-list-component.component";
import {ArticleFormComponent} from "./components/computer/articles/article-form/article-form.component";
import {ArticleMainComponent} from "./components/computer/articles/article-main/article-main.component";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import { DesktopComponent } from './components/computer/desktop/desktop/desktop.component';
import { ArticleGroupComponent } from './components/computer/articles/article-list-component/article-group/article-group.component';
import { ArticleItemComponent } from './components/computer/articles/article-list-component/article-item/article-item.component';
import { ArticleSubGroupComponent } from './components/computer/articles/article-list-component/article-sub-group/article-sub-group.component';
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {SafeHtmlPipe} from "./pipes/safehtml.pipe";

@NgModule({
  declarations: [AppComponent, LoginComponent, GameComponent, ComputerComponent, ArticleListComponentComponent, ArticleFormComponent, ArticleMainComponent, DesktopComponent, ArticleGroupComponent, ArticleItemComponent, ArticleSubGroupComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, NgOptimizedImage, CdkTextareaAutosize, CdkDropList, CdkDrag, SafeHtmlPipe, ReactiveFormsModule,],
  providers: [{
    provide: CURRENT_LEVEL,
    useFactory: (levelManager: LevelManagerService) => levelManager.currentLevel$,
    deps: [LevelManagerService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
