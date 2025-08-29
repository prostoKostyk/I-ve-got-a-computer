import {Component, OnInit} from "@angular/core";

@Component({
  selector: "app-computer",
  templateUrl: "./computer.component.html",
  styleUrl: "./computer.component.less"
})
export class ComputerComponent implements OnInit {
  protected loading: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.loading = false
    }, 100)
  }
}
