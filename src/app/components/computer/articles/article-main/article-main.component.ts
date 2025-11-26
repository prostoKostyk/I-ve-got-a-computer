import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {Article, DeleteGroupInput, Group, SubGroup} from "../../../../models/common";
import {ArticleRestApiService} from "../../../../services/rest-api-articles.service";
import {Observable} from "rxjs";
import {GroupRestApiService} from "../../../../services/rest-api-groups.service";

@Component({
  selector: "app-article-main", templateUrl: "./article-main.component.html", styleUrl: "./article-main.component.less"
})
export class ArticleMainComponent implements OnInit {
  protected articles: Article[] = [];
  protected foundArticles: Article[] = [];
  protected availableGroups: Group[] = [];
  protected availableSubGroups: SubGroup[] = [];
  @Output() openDesktop = new EventEmitter<boolean>();

  constructor(private articleRestApiService: ArticleRestApiService, private groupRestApiService: GroupRestApiService) {
  }

  ngOnInit() {
    this.loadArticles();
  }

  private loadArticles() {
    this.articleRestApiService.getArticles<Article[]>().subscribe({
      next: (articles) => {
        this.articles = articles;
        this.setArticlesByGroups();
      },
      error: (error) => console.error("Error loading articles:", error),
      complete: () => console.log("Complete loading articles")
    });
    this.groupRestApiService.getGroupsWithArticles<Group[]>().subscribe({
      next: (groups) => {
        this.availableGroups = groups;
        this.setArticlesByGroups();
      },
      error: (error) => console.error("Error loading groups:", error),
    });
    this.groupRestApiService.getSubGroupsWithArticles().subscribe({
      next: (subGroups) => {
        this.availableSubGroups = subGroups;
        this.setArticlesByGroups();
      },
      error: (error) => console.error("Error loading subGroups:", error),
    });
  }

  searchArticles(searchValue: string, byContent: boolean) {
    let o: Observable<Article[]> = byContent ?
      this.articleRestApiService.findArticlesByTitleOrContent<Article[]>(searchValue)
      : this.articleRestApiService.findArticlesByTitle<Article[]>(searchValue)
    o.subscribe({
      next: (articles) => {
        this.foundArticles = articles;
        this.setArticlesByGroups(true);
      },
      error: (error) => console.error("Error loading articles:", error),
      complete: () => console.log("Complete")
    });
  }

  cancelSearch() {
    this.setArticlesByGroups();
  }

  private setArticlesByGroups(searched?: boolean) {
  }

  addArticle(article: Article) {
    this.articleRestApiService.addArticle(article).subscribe((newArticles: Article[]) => {
      const newArticle = newArticles[0];
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
    updatedArticle._id && this.articleRestApiService.updateArticle(updatedArticle).subscribe(() => {
      const index = this.articles.findIndex(a => a._id === updatedArticle._id);
      if (index > -1) {
        this.articles[index] = updatedArticle;
      }
    }, (error) => {
      console.error("Error updating article:", error);
    });
  }

  deleteArticle(article: Article) {
    article._id && this.articleRestApiService.deleteArticle(article._id).subscribe(() => {
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
      article._id && this.articleRestApiService.deleteArticle(article._id).subscribe(() => {
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

