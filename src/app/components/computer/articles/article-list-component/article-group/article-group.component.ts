import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, Group} from "../../../../../models/common";

@Component({
  selector: 'app-article-group',
  templateUrl: './article-group.component.html',
  styleUrl: './article-group.component.less'
})
export class ArticleGroupComponent {
  @Input() group: Group;
  @Input() availableGroups: Group[];
  @Input() articles: Article[];
  @Output() groupDeleted = new EventEmitter<Group>();
  @Output() articleDeleted = new EventEmitter<Article>();
  @Output() articleUpdated = new EventEmitter<Article>();
  visibleGroups: { [key: string]: boolean } = {};
  sureButton:boolean;
  sureSureButton:boolean;
  sureSureSureButton:boolean;
  sureSureSureSureButton:boolean;

  getArticlesInGroup(group: Group): Article[] {
    return this.articles.filter(article => article.group === group.group);
  }

  toggleGroup(group: Group) {
    this.visibleGroups[group.group] = !this.visibleGroups[group.group];
  }

  isGroupVisible(group: Group): boolean {
    return this.visibleGroups[group.group];
  }

  deleteGroup(group: Group) {
    this.sureButton = false;
    this.sureSureButton = false;
    this.sureSureSureButton = false;
    this.sureSureSureSureButton = false;
    this.groupDeleted.emit(group);
  }

  updateArticle(article: Article) {
    this.articleUpdated.emit(article);
  }

  deleteArticle(article: Article) {
    this.articleDeleted.emit(article);
  }
}
