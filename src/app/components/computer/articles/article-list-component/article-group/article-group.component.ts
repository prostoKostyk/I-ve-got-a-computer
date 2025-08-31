import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, DeleteGroupInput, Group, SubGroup} from "../../../../../models/common";
import {NOT_DELETED_SECTIONS} from "../../../../../constants/constants";

@Component({
  selector: 'app-article-group',
  templateUrl: './article-group.component.html',
  styleUrl: './article-group.component.less'
})
export class ArticleGroupComponent {
  @Input() group: Group;
  @Input() availableGroups: Group[];
  @Input() articles: Article[];
  @Output() groupDeleted = new EventEmitter<DeleteGroupInput>();
  @Output() articleDeleted = new EventEmitter<Article>();
  @Output() articleUpdated = new EventEmitter<Article>();
  visibleGroups: { [key: string]: boolean } = {};
  sureButtonsArray: boolean[] = [false, false, false, false];

  toggleGroup(group: Group) {
    this.visibleGroups[group.group] = !this.visibleGroups[group.group];
  }

  checkCanBeDeleted(): boolean {
    return NOT_DELETED_SECTIONS.findIndex(s => s === this.group.group) === -1;
  }

  isGroupVisible(group: Group): boolean {
    return this.visibleGroups[group.group];
  }

  updateArticle(article: Article) {
    this.articleUpdated.emit(article);
  }

  deleteGroup(d: DeleteGroupInput) {
    this.sureButtonsArray = this.sureButtonsArray.map(() => false);
    this.groupDeleted.emit({group: d.group, subGroup: d.subGroup});
  }

  deleteArticle(article: Article) {
    this.articleDeleted.emit(article);
  }
}
