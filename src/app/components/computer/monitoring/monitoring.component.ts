import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {Monitoring} from "../../../models/common";
import {RestApiService} from "../../../services/rest-api.service";

@Component({
  selector: "app-monitoring",
  templateUrl: "./monitoring.component.html",
  styleUrl: "./monitoring.component.less"
})
export class MonitoringComponent implements OnInit {
  @Output() openDesktop = new EventEmitter<boolean>();
  protected monitoring: Monitoring[];
  displayedColumns: string[] = ['name', 'url', 'value', 'date'];

  constructor(private restApiService: RestApiService) {
  }

  ngOnInit() {
    this.loadMonitoring();
  }

  private loadMonitoring() {
    this.restApiService.getMonitoring()
      .subscribe({
        next: ((monitoring: Monitoring[]) => {
          this.monitoring = monitoring.sort((a, b) => b.date.localeCompare(a.date));
        })
      })
  }

  protected openDesktopEmit() {
    this.openDesktop.emit(true);
  }
}
