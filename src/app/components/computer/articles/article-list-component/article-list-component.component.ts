import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, DeleteGroupInput, Group, SubGroup} from "../../../../models/common";

@Component({
  selector: "app-article-list-component",
  templateUrl: "./article-list-component.component.html",
  styleUrl: "./article-list-component.component.less"
})
export class ArticleListComponentComponent {
  @Input() articles: Article[];
  @Input() availableGroups: Group[];
  @Output() articleDeleted = new EventEmitter<Article>();
  @Output() groupDeleted = new EventEmitter<DeleteGroupInput>();
  @Output() articleUpdated = new EventEmitter<Article>();

  deleteArticle(article: Article) {
    this.articleDeleted.emit(article);
  }

  deleteGroup(d: DeleteGroupInput) {
    this.groupDeleted.emit({group: d.group, subGroup: d.subGroup});
  }

  updateArticle(article: Article) {
    this.articleUpdated.emit(article);
  }

  closeAllGroups() {
    this.availableGroups.map(g => g.open = false)
  }

}
