import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, Group} from "../../../../../models/common";

@Component({
  selector: "app-article-item", templateUrl: "./article-item.component.html", styleUrl: "./article-item.component.less"
})
export class ArticleItemComponent {
  @Input() article: Article;
  @Input() availableGroups: Group[];
  @Output() articleDeleted = new EventEmitter<Article>();
  @Output() articleUpdated = new EventEmitter<Article>();
  sureButton: boolean;
  sureSureButton: boolean;
  sureSureSureButton: boolean;
  sureSureSureSureButton: boolean;
  visibleArticles: { [key: string]: boolean } = {};
  imageUrlString: string = "";

  toggleArticle(article: any) {
    const articleId = this.getArticleId(article);
    this.visibleArticles[articleId] = !this.visibleArticles[articleId];
  }

  private getArticleId(article: any): string {
    return `${article.title}-${article.group}`;
  }

  isArticleVisible(article: any): boolean {
    return this.visibleArticles[this.getArticleId(article)];
  }

  updateArticle(article: Article) {
    article.imageUrls = this.imageUrlString.split(",").map(url => url.trim()).filter(url => url !== "");
    article.editing = false;
    this.articleUpdated.emit(article);
  }

  editArticleStart(article: Article) {
    article.editing = true;
    this.imageUrlString = article.imageUrls ? article.imageUrls.join(",") : "";
  }

  cancelEdit(article: Article) {
    article.editing = false;
  }

  deleteArticle(article: Article) {
    this.sureButton = false;
    this.sureSureButton = false;
    this.sureSureSureButton = false;
    this.sureSureSureSureButton = false;
    this.articleDeleted.emit(article);
  }
}
