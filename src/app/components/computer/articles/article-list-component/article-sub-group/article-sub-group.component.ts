import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, DeleteGroupInput, Group, SubGroup} from "../../../../../models/common";
import {NOT_DELETED_SECTIONS, NOT_DELETED_SUBSECTIONS} from "../../../../../constants/constants";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {RestApiService} from "../../../../../services/rest-api.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-article-sub-group',
  templateUrl: './article-sub-group.component.html',
  styleUrl: './article-sub-group.component.less'
})
export class ArticleSubGroupComponent {
  @Input() subGroup: SubGroup;
  @Input() availableGroups: Group[];
  @Input() articles: Article[];
  @Output() groupDeleted = new EventEmitter<{ group: Group | null, subGroup?: SubGroup }>();
  @Output() articleDeleted = new EventEmitter<Article>();
  @Output() articleUpdated = new EventEmitter<Article>();
  visibleGroups: { [key: string]: boolean } = {};
  sureButtonsArray: boolean[] = [false, false, false, false];

  constructor(private restApiService: RestApiService) {
  }

  sortArticles() {
    // @ts-ignore
    this.subGroup.articles.sort((a, b) => a.order - b.order);
  }

  toggleGroup(subGroup: SubGroup) {
    this.visibleGroups[subGroup.subGroup] = !this.visibleGroups[subGroup.subGroup];
    this.visibleGroups[subGroup.subGroup] && this.sortArticles();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.subGroup.articles, event.previousIndex, event.currentIndex);
    this.updateArticlesOrder();
    event.previousIndex !== event.currentIndex && this.updateArticlesOrderBackend(event.previousIndex, event.currentIndex)
  }

  updateArticlesOrder(): void {
    this.subGroup.articles.forEach((article, index) => {
      article.order = index + 1;
    });
  }

  updateArticlesOrderBackend(previousIndex: number, currentIndex: number) {
    const updatedArticlePrevious = this.subGroup.articles[previousIndex];
    const updatedArticleCurrent = this.subGroup.articles[currentIndex];
    updatedArticlePrevious._id && updatedArticleCurrent._id && forkJoin(
      this.restApiService.updateArticle(updatedArticlePrevious._id, updatedArticlePrevious),
      this.restApiService.updateArticle(updatedArticleCurrent._id, updatedArticleCurrent),
    ).subscribe(([res1, res2]) => {
      }, (error) => {
        console.error("Error updating article:", error);
      });
  }

  isSubGroupVisible(subGroup: SubGroup): boolean {
    return this.visibleGroups[subGroup.subGroup];
  }

  checkCanBeDeleted(): boolean {
    return NOT_DELETED_SUBSECTIONS.findIndex(s => s === this.subGroup.subGroup) === -1;
  }

  updateArticle(article: Article) {
    this.articleUpdated.emit(article);
  }

  deleteGroup(deleteGroupInput: DeleteGroupInput) {
    this.sureButtonsArray = this.sureButtonsArray.map(() => false);
    this.groupDeleted.emit({group: null, subGroup: deleteGroupInput.subGroup});
  }

  deleteArticle(article: Article) {
    this.articleDeleted.emit(article);
  }
}
