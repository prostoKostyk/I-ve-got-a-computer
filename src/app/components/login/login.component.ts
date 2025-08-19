import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {User} from "../../models/common";
import {RestApiService} from "../../services/rest-api.service";

@Component({
  selector: "app-login", templateUrl: "./login.component.html", styleUrl: "./login.component.less"
})
export class LoginComponent implements OnInit {

  @Output() userLogin: EventEmitter<User> = new EventEmitter<User>();
  @ViewChild("addButton") addButton!: ElementRef;
  protected users: User[] = [];
  protected user: User = {name: ""};
  protected userNameInput: string = "";
  protected userName: string = "";

  constructor(protected restApiService: RestApiService) {
  }

  ngOnInit() {
  }

  onEnter() {
    this.addButton.nativeElement.click();
  }

  protected addUser() {
    if (this.userNameInput && this.userNameInput.length < 20) {
      localStorage.setItem("userName", this.userNameInput);
      this.user.name = this.userNameInput;
      this.userLogin.emit(this.user);
      this.restApiService.addUser(this.user).pipe().subscribe((user) => {
        this.users.push(user);
      })
    }
  }
}
