import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import {Article, Group, SubGroup} from "../../../../models/common";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ArticleFormFields} from "../../../../constants/constants";
import {RestApiService} from "../../../../services/rest-api.service";

interface ArticleFormGroup {
  [ArticleFormFields.SELECTED_GROUP]: FormControl<string | null>;
  [ArticleFormFields.SELECTED_SUB_GROUP]: FormControl<string | null>;
  [ArticleFormFields.NEW_GROUP]: FormControl<string | null>;
  [ArticleFormFields.NEW_SUB_GROUP]: FormControl<string | null>;
  [ArticleFormFields.TITLE]: FormControl<string | null>;
  [ArticleFormFields.IMAGE_URL]: FormControl<string | null>;
  [ArticleFormFields.CONTENT]: FormControl<string | null>;
  [ArticleFormFields.IGNORE_HTML]: FormControl<boolean | null>;
}

@Component({
  selector: "app-article-form",
  templateUrl: "./article-form.component.html",
  styleUrl: "./article-form.component.less"
})

export class ArticleFormComponent implements AfterViewInit, OnInit {
  @Input() availableGroups: Group[];
  @Input() availableSubGroups: SubGroup[];
  @Input() isEditMode: boolean = false;
  @Output()
  articleAdded = new EventEmitter<Article>();
  @Output()
  stopEdit = new EventEmitter();
  @Output()
  setArticle = new EventEmitter<Article>()
  @Input()
  article: Article;

  public group: FormGroup<ArticleFormGroup>;
  formVisible: boolean;
  filteredSubGroups: SubGroup[];
  isBoldText: boolean;

  cursorPosition: number;
  selectionStart: number;
  selectionEnd: number;
  readonly FIELDS = ArticleFormFields;
  // selectedText: string;

  @ViewChild("textarea") textarea: ElementRef;

  constructor(private formBuilder: FormBuilder, private restApiService: RestApiService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
  }

  get selectedGroupFormControl(): FormControl {
    return this.group.get(ArticleFormFields.SELECTED_GROUP) as FormControl;
  }

  get selectedSubGroupFormControl(): FormControl {
    return this.group.get(ArticleFormFields.SELECTED_SUB_GROUP) as FormControl;
  }

  get newGroupFormControl(): FormControl {
    return this.group.get(ArticleFormFields.NEW_GROUP) as FormControl;
  }

  get newSubGroupFormControl(): FormControl {
    return this.group.get(ArticleFormFields.NEW_SUB_GROUP) as FormControl;
  }

  get titleFormControl(): FormControl {
    return this.group.get(ArticleFormFields.TITLE) as FormControl;
  }

  get imageUrlFormControl(): FormControl {
    return this.group.get(ArticleFormFields.IMAGE_URL) as FormControl;
  }

  get contentFormControl(): FormControl {
    return this.group.get(ArticleFormFields.CONTENT) as FormControl;
  }

  get ignoreHtmlFormControl(): FormControl {
    return this.group.get(ArticleFormFields.IGNORE_HTML) as FormControl;
  }


  ngOnInit() {
    this.formVisible = this.isEditMode;
    this.initGroup();
    this.isEditMode && this.onSelectedGroupChange();
  }

  initGroup() {
    this.group = this.formBuilder.group({
      [ArticleFormFields.SELECTED_GROUP]: this.formBuilder.control(this.article?.group ?? "", [Validators.required]),
      [ArticleFormFields.SELECTED_SUB_GROUP]: this.formBuilder.control(this.article?.subGroup ?? "", [Validators.required]),
      [ArticleFormFields.NEW_GROUP]: this.formBuilder.control("", []),
      [ArticleFormFields.NEW_SUB_GROUP]: this.formBuilder.control("", []),
      [ArticleFormFields.TITLE]: this.formBuilder.control(this.article?.title ?? "", [Validators.required]),
      [ArticleFormFields.IMAGE_URL]: this.formBuilder.control("", []),
      [ArticleFormFields.CONTENT]: this.formBuilder.control(this.article?.content ?? "", [Validators.required]),
      [ArticleFormFields.IGNORE_HTML]: this.formBuilder.control(this.article?.ignoreHtml, [Validators.required]),
    });
  }

  ngAfterViewInit() {
    this.updateCursorPosition();
  }

  toggleForm() {
    this.isEditMode ? this.stopEdit.emit(this.article) : this.formVisible = !this.formVisible;
  }

  addArticle() {
    const newArticle = {title: "", content: "", group: "", subGroup: "", order: 999999999999999, ignoreHtml: false};
    if (this.selectedGroupFormControl.value === "" && this.newGroupFormControl.value) {
      newArticle.group = this.newGroupFormControl.value;
    } else {
      newArticle.group = this.selectedGroupFormControl.value;
    }
    if (this.selectedSubGroupFormControl.value === "" && this.newSubGroupFormControl.value) {
      newArticle.subGroup = this.newSubGroupFormControl.value;
      newArticle.order = 1;
    } else {
      newArticle.subGroup = this.selectedSubGroupFormControl.value;
      const subGroup = this.availableSubGroups.find(sb => sb.articles.findIndex(sb2 => sb2.subGroup === newArticle.subGroup) > -1);
      newArticle.order = (subGroup?.articles.length || 999999999999999) + 1;
    }
    newArticle.title = this.titleFormControl.value;
    newArticle.content = this.contentFormControl.value;
    newArticle.ignoreHtml = this.ignoreHtmlFormControl.value !== null ? this.ignoreHtmlFormControl.value : false;
    if (this.isEditMode) {
      this.updateArticle(newArticle);
    } else {
      this.articleAdded.emit(newArticle);
      this.initGroup();
    }
    this.isBoldText = false;
  }

  updateArticle(newArticle: Article) {
    // @ts-ignore
    newArticle._id = this.article._id;
    newArticle._id !== "" && this.restApiService.updateArticle(newArticle).subscribe({
      next: (updatedArticle: Article) => {
          this.setArticle.emit(updatedArticle);
          this.toggleForm();
      },
      error: (err) => console.error("Error updating article:", err)
    });
  }

  onSelectedGroupChange() {
    if (this.selectedGroupFormControl.value === "") {
      this.selectedSubGroupFormControl.patchValue("");
      this.filteredSubGroups = []
    } else {
      this.filteredSubGroups = this.availableSubGroups.filter((sb) => sb.parentGroup === this.selectedGroupFormControl.value);
    }
  }

  updateCursorPosition() {
    if (this.textarea && this.textarea.nativeElement) {
      this.cursorPosition = this.textarea.nativeElement.selectionStart;
      const textarea = this.textarea.nativeElement;
      this.selectionStart = textarea.selectionStart;
      this.selectionEnd = textarea.selectionEnd;
      // this.selectedText = textarea.value.substring(this.selectionStart, this.selectionEnd);
    } else {
      this.cursorPosition = this.contentFormControl.value.length - 1;
      this.selectionStart = -1;
      this.selectionEnd = -1;
      // this.selectedText = '';
    }
  }

  insertTag(openTag: string, closeTag: string) {
    const currentInput = this.contentFormControl.value;
    if (!this.isBoldText && this.selectionStart !== this.selectionEnd) { // Вставка тегов вокруг выделленого текста
      this.contentFormControl.patchValue(currentInput.slice(0, this.selectionStart) + openTag
        + currentInput.slice(this.selectionStart, this.selectionEnd) + closeTag
        + currentInput.slice(this.selectionEnd));
      return;
    }
    this.isBoldText = !this.isBoldText;
    this.contentFormControl.patchValue(currentInput.slice(0, this.cursorPosition) + (this.isBoldText ? "<b>" : "</b>") + currentInput.slice(this.cursorPosition));
  }

  insertIMG() {
    const currentInput = this.contentFormControl.value;
    const image = " <p><img src=\"" + this.imageUrlFormControl.value + "\" alt=\"В\" style=\"max-width: 100%;\"></p> "
    this.contentFormControl.patchValue(currentInput.slice(0, this.cursorPosition) + image + currentInput.slice(this.cursorPosition));
    this.imageUrlFormControl.patchValue("");
  }
}
