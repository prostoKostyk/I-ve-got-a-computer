import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {Article, createEmptyArticle, Group, SubGroup} from "../../../../models/common";

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.less'
})

export class ArticleFormComponent implements AfterViewInit, OnInit  {
  @Input() availableGroups: Group[];
  @Input() availableSubGroups: SubGroup[];
  @Output() articleAdded = new EventEmitter<Article>();

  formVisible: boolean;
  newArticle: Article;
  newGroupName: string = '';
  newSubGroupName: string = '';
  filteredSubGroups: SubGroup[];
  imageUrlString: string = '';
  isBoldText: boolean;
  imageUrlInput: string;

  cursorPosition: number;
  selectionStart: number;
  selectionEnd: number;
  // selectedText: string;

  @ViewChild('textarea') textarea: ElementRef;

  ngOnInit() {
    this.newArticle = createEmptyArticle();
  }

  ngAfterViewInit() {
    this.updateCursorPosition();
  }

  toggleForm() {
    this.formVisible = !this.formVisible;
  }

  addArticle() {
    if (this.newArticle.group === '' && this.newGroupName) {
      this.newArticle.group = this.newGroupName;
    }
    if (this.newArticle.subGroup === '' && this.newSubGroupName) {
      this.newArticle.subGroup = this.newSubGroupName;
      this.newArticle.order = 1;
    } else {
      const subGroup = this.availableSubGroups.find(sb => sb.articles.findIndex(sb2 => sb2.subGroup === this.newArticle.subGroup) > -1);
      this.newArticle.order = (subGroup?.articles.length || 999999999999999) + 1;
    }
    this.newArticle.imageUrls = this.imageUrlString;
    this.articleAdded.emit(this.newArticle);
    this.newArticle = createEmptyArticle();
    this.imageUrlString = '';
    this.newGroupName = '';
    this.newSubGroupName = '';
    this.isBoldText = false;
    this.imageUrlInput = "";
  }

  filterSubGroups() {
    this.filteredSubGroups = this.availableSubGroups.filter((sb) => sb.parentGroup === this.newArticle.group);
  }

  updateCursorPosition() {
    if (this.textarea && this.textarea.nativeElement) {
      this.cursorPosition = this.textarea.nativeElement.selectionStart;
      const textarea = this.textarea.nativeElement;
      this.selectionStart = textarea.selectionStart;
      this.selectionEnd = textarea.selectionEnd;
      // this.selectedText = textarea.value.substring(this.selectionStart, this.selectionEnd);
    } else {
      this.cursorPosition = this.newArticle.content.length - 1;
      this.selectionStart = -1;
      this.selectionEnd = -1;
      // this.selectedText = '';
    }
  }

  insertBoldTag() {
    const currentInput = this.newArticle.content;
    if (!this.isBoldText && this.selectionStart !== this.selectionEnd) { // Вставка тегов вокруг выделленого текста
      this.newArticle.content =
        currentInput.slice(0, this.selectionStart) + "<b>"
        + currentInput.slice(this.selectionStart, this.selectionEnd) + "</b>"
        + currentInput.slice(this.selectionEnd);
      return;
    }
    this.isBoldText = !this.isBoldText;
    this.newArticle.content = currentInput.slice(0, this.cursorPosition) + (this.isBoldText ? "<b>" : "</b>") + currentInput.slice(this.cursorPosition);
  }

  insertIMG() {
    const currentInput = this.newArticle.content;
    const image = " <p><img src=\"" + this.imageUrlInput + "\" alt=\"В\" style=\"max-width: 100%;\"></p> "
    this.newArticle.content = currentInput.slice(0, this.cursorPosition) + image + currentInput.slice(this.cursorPosition);
    this.imageUrlInput = ""
  }
}
