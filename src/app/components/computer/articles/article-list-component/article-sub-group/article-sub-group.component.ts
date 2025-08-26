import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, Group, SubGroup} from "../../../../../models/common";

@Component({
  selector: 'app-article-sub-group',
  templateUrl: './article-sub-group.component.html',
  styleUrl: './article-sub-group.component.less'
})
export class ArticleSubGroupComponent {
  @Input() subGroup: SubGroup;
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

  toggleGroup(subGroup: SubGroup) {
    this.visibleGroups[subGroup.subGroup] = !this.visibleGroups[subGroup.subGroup];
  }

  isGroupVisible(subGroup: SubGroup): boolean {
    return this.visibleGroups[subGroup.subGroup];
  }

  deleteGroup(group: Group) {
    // this.sureButton = false;
    // this.sureSureButton = false;
    // this.sureSureSureButton = false;
    // this.sureSureSureSureButton = false;
    // this.groupDeleted.emit(group);
  }

  updateArticle(article: Article) {
    this.articleUpdated.emit(article);
  }

  deleteArticle(article: Article) {
    this.articleDeleted.emit(article);
  }
}
