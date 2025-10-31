import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {RestApiService} from "../../../../services/rest-api.service";
import {Article, DeleteGroupInput, Group, SubGroup} from "../../../../models/common";

@Component({
  selector: "app-article-main", templateUrl: "./article-main.component.html", styleUrl: "./article-main.component.less"
})
export class ArticleMainComponent implements OnInit {
  protected articles: Article[] = [];
  protected availableGroups: Group[] = [];
  protected availableSubGroups: SubGroup[] = [];
  @Output() openDesktop = new EventEmitter<boolean>();

  constructor(private restApiService: RestApiService) {
  }

  ngOnInit() {
    this.loadArticles();
  }

  private loadArticles() {
    this.restApiService.getArticles<Article[]>().subscribe({
      next: (articles) => {
          this.articles = articles;
          this.availableGroups = [];
          this.availableSubGroups = [];
          this.setArticlesByGroups();
      },
      error: (error) => console.error("Error loading articles:", error),
      complete: () => console.log('Complete')
    });
  }

  private setArticlesByGroups() {
    this.articles.forEach(a => {
      const subGroupIndex = this.availableSubGroups.findIndex(g => a.subGroup === g.subGroup);
      if (subGroupIndex > -1) {
        this.availableSubGroups[subGroupIndex].articles.push(a);
      } else {
        this.availableSubGroups.push({
            subGroup: a.subGroup,
            parentGroup: a.group,
            articles: [a]
          });
      }
    })
    this.availableSubGroups.forEach(subG => {
      const groupIndex = this.availableGroups.findIndex(g => g.group === subG.parentGroup);
      if (groupIndex > -1) {
        this.availableGroups[groupIndex].subGroups.push(subG);
      } else {
        this.availableGroups.push({group: subG.parentGroup, subGroups: [subG]});
      }
    })
  }

  addArticle(article: Article) {
    this.restApiService.addArticle(article).subscribe((newArticle) => {
      this.articles.push(newArticle);
      let indexOfGroup = this.availableGroups.findIndex(g => g.group === newArticle.group)
      if (indexOfGroup === -1) {
        this.availableGroups.push({group: newArticle.group, subGroups: []});
        indexOfGroup = this.availableGroups.length - 1;
      }

      const indexOfSubGroupInGroups = this.availableGroups[indexOfGroup].subGroups.findIndex(sg => sg.subGroup === newArticle.subGroup);
      if (indexOfSubGroupInGroups > -1) {
        this.availableGroups[indexOfGroup].subGroups[indexOfSubGroupInGroups].articles.push(newArticle);
      } else {
        this.availableGroups[indexOfGroup].subGroups.push({
          subGroup: newArticle.subGroup,
          articles: [newArticle],
          parentGroup: newArticle.group
        });
      }
    }, (error) => {
      console.error("Error adding article:", error);
    });
  }

  updateArticle(updatedArticle: Article) {
    updatedArticle._id && this.restApiService.updateArticle(updatedArticle).subscribe(() => {
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
      this.loadArticles();
    }, (error) => {
      console.error("Error deleting article:", error);
    });
  }

  /**
   * Deleting groups or subGroups
   */
  deleteGroupOrSubGroup(d: DeleteGroupInput) {
    const articlesInGroup = d.subGroup ?
      this.articles.filter(article => article.subGroup === d.subGroup?.subGroup) :
      this.articles.filter(article => article.group === d.group?.group);
    articlesInGroup.forEach((article, index) => {
      article._id && this.restApiService.deleteArticle(article._id).subscribe(() => {
        index === articlesInGroup.length - 1 && this.loadArticles();
      }, (error) => {
        console.error("Error deleting article:", error);
      });
    })
  }

  openDesktopEmit() {
    this.openDesktop.emit(true);
  }
}

