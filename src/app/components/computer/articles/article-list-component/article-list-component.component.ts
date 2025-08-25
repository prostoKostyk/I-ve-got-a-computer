import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, Group} from "../../../../models/common";

@Component({
  selector: 'app-article-list-component',
  templateUrl: './article-list-component.component.html',
  styleUrl: './article-list-component.component.less'
})
export class ArticleListComponentComponent {
  @Input() articles: Article[];
  @Input() availableGroups: Group[];
  @Output() articleDeleted = new EventEmitter<Article>();
  @Output() groupDeleted = new EventEmitter<Group>();
  @Output() articleUpdated = new EventEmitter<Article>();

  deleteArticle(article: Article) {
    this.articleDeleted.emit(article);
  }

  deleteGroup(group: Group) {
    this.groupDeleted.emit(group);
  }

  updateArticle(article: Article) {
    this.articleUpdated.emit(article);
  }

}
