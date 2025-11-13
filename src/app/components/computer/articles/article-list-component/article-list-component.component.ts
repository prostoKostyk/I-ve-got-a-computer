import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, DeleteGroupInput, Group, SubGroup} from "../../../../models/common";
import {ArticleFormFields} from "../../../../constants/constants";

@Component({
  selector: "app-article-list-component",
  templateUrl: "./article-list-component.component.html",
  styleUrl: "./article-list-component.component.less"
})
export class ArticleListComponentComponent {
  @Input() articles: Article[];
  @Input() availableGroups: Group[];
  @Input() availableSubGroups: SubGroup[];
  @Output() articleDeleted = new EventEmitter<Article>();
  @Output() groupDeleted = new EventEmitter<DeleteGroupInput>();
  @Output() articleUpdated = new EventEmitter<Article>();
  @Output() searchArticles = new EventEmitter<{searchInput: string, searchByContent: boolean}>();
  @Output() cancelSearch = new EventEmitter();

  protected searchInput: string;
  protected searchByContent = true;
  protected searchVisible = false;
  protected iframeVisible = false;

  deleteArticle(article: Article) {
    this.articleDeleted.emit(article);
  }

  deleteGroup(d: DeleteGroupInput) {
    this.groupDeleted.emit({group: d.group, subGroup: d.subGroup});
  }

  updateArticle(article: Article) {
    this.articleUpdated.emit(article);
  }

  _searchArticles() {
    if (this.searchInput.length < 1) return;
    this.searchArticles.emit({searchInput: this.searchInput, searchByContent: this.searchByContent});
  }

  _cancelSearch() {
    this.cancelSearch.emit();
    this.searchVisible = false;
  }

  closeAllGroups() {
    this.availableGroups.map(g => g.open = false)
  }
}
