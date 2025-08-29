import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {APP_CONDITION} from "../../../../constants/constants";

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.less'
})
export class DesktopComponent implements OnInit {
  protected desktopVisible: boolean = true;
  protected articleVisible: boolean;

  ngOnInit() {
    const currentState = localStorage.getItem("c");
    if (currentState === APP_CONDITION.COMPUTER_OPENED_ARTICLES) {
      this.openArticle();
    }
  }

  openArticle() {
    localStorage.setItem("c", APP_CONDITION.COMPUTER_OPENED_ARTICLES);
    this.articleVisible = true;
    this.desktopVisible = false;
  }

  openDesktop() {
    localStorage.setItem("c", APP_CONDITION.COMPUTER_OPENED);
    this.desktopVisible = true;
    this.articleVisible = false;
  }

  goToGame() {
    localStorage.setItem("c", APP_CONDITION.GAME);
  }
}
