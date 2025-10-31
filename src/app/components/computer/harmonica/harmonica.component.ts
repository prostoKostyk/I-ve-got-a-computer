import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {Article, HarmonicaNotes} from "../../../models/common";
import {RestApiService} from "../../../services/rest-api.service";

@Component({
  selector: "app-harmonica",
  templateUrl: "./harmonica.component.html",
  styleUrl: "./harmonica.component.less"
})
export class HarmonicaComponent implements OnInit {
  @Output() openDesktop = new EventEmitter<boolean>();
  blowNotes: Array<string> = ["C", "E", "G", "C", "E", "G", "C", "E", "G", "C"];
  drawNotes: Array<string> = ["D", "G", "B", "D", "F", "A", "B", "D", "F", "A"];
  blowNotesRus: Array<string> = ["До", "Ми", "Соль", "До", "Ми", "Соль", "До", "Ми", "Соль", "До"];
  drawNotesRus: Array<string> = ["Ре", "Соль", "Си", "Ре", "Фа", "Ля", "Си", "Ре", "Фа", "Ля"];
  isEngNotes: boolean = true;
  currentInput: string;
  newNotes: HarmonicaNotes = {tabs: ""};
  formVisible: boolean;

  notes: Array<HarmonicaNotes> = [];

  protected readonly Array = Array;

  constructor(private restApiService: RestApiService) {
  }

  ngOnInit() {
    this.getNotes();
  }

  openDesktopEmit() {
    this.openDesktop.emit(true);
  }

  getNotes() {
    this.restApiService.getHarmonicaNotes<HarmonicaNotes[]>().subscribe({
      next: (notes) => this.notes = notes,
      error: error => console.error("Error loading articles:", error),
    });
  }

  addNotes() {
    this.restApiService.addHarmonicaNotes(this.newNotes).subscribe((notes) => {
      this.notes.push(notes);
      this.newNotes.tabs = "";
      this.newNotes.title = "";
    }, (error) => {
      console.error("Error adding article:", error);
    });
  }

  toggleForm() {
    this.formVisible = !this.formVisible;
  }
}
