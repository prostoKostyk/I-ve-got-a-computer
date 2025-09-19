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
  @Output()
  groupDeleted = new EventEmitter<{ group: Group | null, subGroup?: SubGroup }>();
  @Output()
  articleDeleted = new EventEmitter<Article>();
  @Output()
  articleUpdated = new EventEmitter<Article>();
  @Input()
  subGroup: SubGroup;
  @Input()
  availableGroups: Group[];
  @Input()
  availableSubGroups: SubGroup[];
  @Input()
  articles: Article[];
  private visibleSubGroups: { [key: string]: boolean } = {};
  protected sureButtonsArray: boolean[] = [false, false, false, false];

  constructor(private restApiService: RestApiService) {
  }

  private sortArticles() {
    this.subGroup.articles.sort((a, b) => a.order - b.order);
  }

  toggleSubGroup() {
    this.visibleSubGroups[this.subGroup.subGroup] = !this.visibleSubGroups[this.subGroup.subGroup];
    this.visibleSubGroups[this.subGroup.subGroup] && this.sortArticles();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.subGroup.articles, event.previousIndex, event.currentIndex);
    event.previousIndex !== event.currentIndex && this.updateArticlesOrderBackend(event.previousIndex, event.currentIndex)
  }

  private updateArticlesOrder(): void {
    this.subGroup.articles.forEach((article, index) => {
      article.order = index + 1;
    });
  }

  private updateArticlesOrderBackend(previousIndex: number, currentIndex: number) {
    const updatedArticlePrevious = this.subGroup.articles[previousIndex];
    const updatedArticleCurrent = this.subGroup.articles[currentIndex];
    updatedArticlePrevious._id && updatedArticleCurrent._id && forkJoin(
      this.restApiService.updateArticle(updatedArticlePrevious),
      this.restApiService.updateArticle(updatedArticleCurrent),
    ).subscribe(([res1, res2]) => {
      this.updateArticlesOrder();
      }, (error) => {
        console.error("Error updating article:", error);
      });
  }

  isSubGroupVisible(subGroup: SubGroup): boolean {
    return this.visibleSubGroups[subGroup.subGroup];
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
