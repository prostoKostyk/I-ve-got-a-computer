import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {User} from "./models/common";
import {RestApiService} from "./services/rest-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {

  protected user: User = { name: ""};
  protected userName: string = "";
  constructor(private restApiService: RestApiService) {
  }

  ngOnInit() {
    this.user.name = localStorage.getItem('userName') ?? "";
  }
  protected setUser(user: User) {
    this.user = user;
  }

  private getUsers(): Observable<User[]> {
    return this.restApiService.getUsers();
  }
}
