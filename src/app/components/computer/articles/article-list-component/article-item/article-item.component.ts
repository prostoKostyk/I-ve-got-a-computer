import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, Group} from "../../../../../models/common";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {RestApiService} from "../../../../../services/rest-api.service";

@Component({
  selector: "app-article-item", templateUrl: "./article-item.component.html", styleUrl: "./article-item.component.less"
})
export class ArticleItemComponent {
  @Input() article: Article;
  @Input() availableGroups: Group[];
  @Output() articleDeleted = new EventEmitter<Article>();
  @Output() articleUpdated = new EventEmitter<Article>();
  sureButtonsArray: boolean[] = [false, false, false];
  visibleArticles: { [key: string]: boolean } = {};
  imageUrlsArray: string[] = [];

  constructor(private restApiService: RestApiService) {
  }

  toggleArticle(article: any) {
    const articleId = this.getArticleId(article);
    this.visibleArticles[articleId] = !this.visibleArticles[articleId];
    this.visibleArticles[articleId] && this.getImagesArray();
  }

  private getArticleId(article: any): string {
    return `${article.title}-${article.group}`;
  }

  isArticleVisible(article: any): boolean {
    return this.visibleArticles[this.getArticleId(article)];
  }

  getImagesArray() {
    this.imageUrlsArray = this.article.imageUrls?.split(",") || [];
  }

  updateArticle(article: Article) {
    article.editing = false;
    this.articleUpdated.emit(article);
  }

  editArticleStart(article: Article) {
    article.editing = true;
  }

  cancelEdit(article: Article) {
    article.editing = false;
  }

  deleteArticle(article: Article) {
    this.sureButtonsArray = this.sureButtonsArray.map(() => false);
    this.articleDeleted.emit(article);
  }

  updateDoneField(event: MatCheckboxChange) {
    this.article._id && this.restApiService.updateArticle(this.article._id, this.article).subscribe({
      next: (s) => console.log(s),
      error: (err) => console.error("Error updating article:", err)
    });
  }
}
