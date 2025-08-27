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
  sureButton:boolean;
  sureSureButton:boolean;
  sureSureSureButton:boolean;
  sureSureSureSureButton:boolean;

  toggleGroup(group: Group) {
    this.visibleGroups[group.group] = !this.visibleGroups[group.group];
  }

  checkCanBeDeleted(): boolean {
    return NOT_DELETED_SECTIONS.findIndex(s => s === this.group.group) === -1;
  }

  isGroupVisible(group: Group): boolean {
    return this.visibleGroups[group.group];
  }

  deleteGroup(d: DeleteGroupInput) {
    this.sureButton = false;
    this.sureSureButton = false;
    this.sureSureSureButton = false;
    this.sureSureSureSureButton = false;
    this.groupDeleted.emit({group: d.group, subGroup: d.subGroup});
  }

  updateArticle(article: Article) {
    this.articleUpdated.emit(article);
  }

  deleteArticle(article: Article) {
    this.articleDeleted.emit(article);
  }
}
