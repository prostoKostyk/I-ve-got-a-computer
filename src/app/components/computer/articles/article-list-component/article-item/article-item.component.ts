import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, Group, SubGroup} from "../../../../../models/common";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {ArticleRestApiService} from "../../../../../services/rest-api-articles.service";

@Component({
  selector: "app-article-item", templateUrl: "./article-item.component.html", styleUrl: "./article-item.component.less"
})
export class ArticleItemComponent {
  @Input() article: Article;
  @Input() availableGroups: Group[];
  @Input() availableSubGroups: SubGroup[];
  @Output() articleDeleted = new EventEmitter<Article>();
  @Output() articleUpdated = new EventEmitter<Article>();
  protected sureButtonsArray: boolean[] = [false, false, false];
  private visibleArticles: { [key: string]: boolean } = {};
  protected imageUrlsArray: string[] = [];

  constructor(private articleRestApiService: ArticleRestApiService) {
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

  private getImagesArray() {
    this.imageUrlsArray = this.article.imageUrls?.split(",") || [];
  }

  setArticle(article: Article) {
    this.article = article;
  }

  startEdit(article: Article) {
    article.editing = true;
  }

  stopEdit(article: Article) {
    article.editing = false;
  }

  deleteArticle(article: Article) {
    this.sureButtonsArray = this.sureButtonsArray.map(() => false);
    this.articleDeleted.emit(article);
  }

  updateDoneField(event: MatCheckboxChange) {
    this.article._id && this.articleRestApiService.updateArticle(this.article).subscribe({
      next: (s: Object) => console.log(s),
      error: (err: Object) => console.error("Error updating article:", err)
    });
  }
}
