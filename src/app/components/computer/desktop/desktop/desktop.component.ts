import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {APP_CONDITION} from "../../../../constants/constants";

@Component({
  selector: "app-desktop",
  templateUrl: "./desktop.component.html",
  styleUrl: "./desktop.component.less"
})
export class DesktopComponent implements OnInit {
  protected desktopVisible: boolean = true;
  protected articleVisible: boolean;
  protected harmonicaVisible: boolean;
  protected monitoringVisible: boolean;

  ngOnInit() {
    const currentState = localStorage.getItem("c");
    switch (currentState) {
      case APP_CONDITION.COMPUTER_OPENED_ARTICLES:
        this.openArticle();
        break
      case APP_CONDITION.COMPUTER_OPENED_HARMONICA:
        this.openHarmonica();
        break
      case APP_CONDITION.COMPUTER_OPENED_MONITORING:
        this.openMonitoring();
        break
    }
  }

  openArticle() {
    localStorage.setItem("c", APP_CONDITION.COMPUTER_OPENED_ARTICLES);
    this.articleVisible = true;
    this.desktopVisible = false;
  }

  openHarmonica() {
    localStorage.setItem("c", APP_CONDITION.COMPUTER_OPENED_HARMONICA);
    this.harmonicaVisible = true;
    this.desktopVisible = false;
  }

  openMonitoring() {
    localStorage.setItem("c", APP_CONDITION.COMPUTER_OPENED_MONITORING);
    this.monitoringVisible = true;
    this.desktopVisible = false;
  }

  openDesktop() {
    localStorage.setItem("c", APP_CONDITION.COMPUTER_OPENED);
    this.desktopVisible = true;
    this.articleVisible = false;
    this.harmonicaVisible = false;
    this.monitoringVisible = false;
  }

  goToGame() {
    localStorage.setItem("c", APP_CONDITION.GAME);
  }
}
