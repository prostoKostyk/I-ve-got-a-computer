import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {RestApiService} from "../../../../services/rest-api.service";
import {Article, Group} from "../../../../models/common";

@Component({
  selector: "app-article-main", templateUrl: "./article-main.component.html", styleUrl: "./article-main.component.less"
})
export class ArticleMainComponent implements OnInit {
  articles: Article[] = [];
  availableGroups: Group[] = [];
  @Output() openDesktop = new EventEmitter<boolean>();

  constructor(private restApiService: RestApiService) {
  }

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.restApiService.getArticles<Article[]>().subscribe((articles) => {
      this.articles = articles;
      this.articles.forEach(a => {
        const groupIndex = this.availableGroups.findIndex(g => a.group === g.group);
        if (groupIndex > -1) {
          this.availableGroups[groupIndex].articles.push(a);
        } else {
          this.availableGroups.push({group: a.group, articles: [a]});
        }
      })
      console.log(this.availableGroups);
    }, (error) => {
      console.error("Error loading articles:", error);
    });
  }

  addArticle(article: Article) {
    this.restApiService.addArticle(article).subscribe((newArticle) => {
      this.articles.push(newArticle);
      let indexOfArticleGroup = this.availableGroups.findIndex(g => g.group === newArticle.group)
      if (indexOfArticleGroup > -1) {
        this.availableGroups[indexOfArticleGroup].articles.push(newArticle);
      } else {
        this.availableGroups.push({group: newArticle.group, articles: [newArticle]});
      }
    }, (error) => {
      console.error("Error adding article:", error);
    });
  }

  updateArticle(updatedArticle: Article) {
    updatedArticle._id && this.restApiService.updateArticle(updatedArticle._id, updatedArticle).subscribe(() => {
      const index = this.articles.findIndex(a => a._id === updatedArticle._id);
      if (index > -1) {
        this.articles[index] = updatedArticle;
      }
    }, (error) => {
      console.error("Error updating article:", error);
    });
  }

  deleteArticle(article: Article) {
    article._id && this.restApiService.deleteArticle(article._id).subscribe(() => {
      this.articles = this.articles.filter(a => a._id !== article._id); // Remove from local array
    }, (error) => {
      console.error("Error deleting article:", error);
    });
  }

  deleteGroup(group: string) {
    // 1. Delete articles in group on the server
    const articlesInGroup = this.articles.filter(article => article.group === group);
    articlesInGroup.forEach(article => {
      article._id && this.restApiService.deleteArticle(article._id).subscribe(() => {
        //2.  Remove the articles for the group from the local articles array
        this.articles = this.articles.filter(a => a.group !== group);
      }, (error) => {
        console.error("Error deleting article:", error);
      });
    })

    // 3. Remove the group from the local availableGroups array after all articles are deleted
    this.availableGroups = this.availableGroups.filter(g => g.group !== group);
  }

  openDesktopEmit() {
    this.openDesktop.emit(true);
  }
}

