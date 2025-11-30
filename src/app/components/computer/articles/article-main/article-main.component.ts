import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {
  AddArticleInput,
  Article,
  DeleteGroupInput,
  Group,
  GroupInput,
  SubGroup,
  SubGroupInput
} from "../../../../models/common";
import {ArticleRestApiService} from "../../../../services/rest-api-articles.service";
import {finalize, Observable} from "rxjs";
import {GroupRestApiService} from "../../../../services/rest-api-groups.service";

@Component({
  selector: "app-article-main", templateUrl: "./article-main.component.html", styleUrl: "./article-main.component.less"
})
export class ArticleMainComponent implements OnInit {
  protected articles: Article[] = [];
  protected foundArticles: Article[] = [];
  protected availableGroups: Group[] = [];
  protected availableSubGroups: SubGroup[] = [];
  protected isLoading = false;
  @Output() openDesktop = new EventEmitter<boolean>();

  constructor(private articleRestApiService: ArticleRestApiService, private groupRestApiService: GroupRestApiService) {
  }

  ngOnInit() {
    this.loadArticles();
  }

  private loadArticles() {
    this.isLoading = true;
    this.articleRestApiService.getArticles<Article[]>()
      .subscribe({
        next: (articles) => {
          this.articles = articles;
        },
        error: (error) => console.error("Error loading articles:", error),
        complete: () => console.log("Complete loading articles")
      });
    this.groupRestApiService.getGroupsWithArticles<Group[]>().subscribe({
      next: (groups) => {
        this.availableGroups = groups;
      },
      error: (error) => console.error("Error loading groups:", error),
    });
    this.groupRestApiService.getSubGroupsWithArticles()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (subGroups) => {
          this.availableSubGroups = subGroups;
        },
        error: (error) => console.error("Error loading subGroups:", error),
      });
  }

  searchArticles(searchValue: string, byContent: boolean) {
    this.isLoading = true
    this.foundArticles = [];
    let searchObservable: Observable<Article[]> = byContent ?
      this.articleRestApiService.findArticlesByTitleOrContent<Article[]>(searchValue)
      : this.articleRestApiService.findArticlesByTitle<Article[]>(searchValue)
    searchObservable
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (articles) => {
          articles.length > 0 ? this.foundArticles = articles : this.foundArticles.push({title: "Nothing found"} as Article);
        },
        error: (error) => console.error("Error loading articles:", error),
        complete: () => console.log("Complete")
      });
  }

  cancelSearch() {
    this.foundArticles = [];
  }

  addArticle(input: AddArticleInput) {
    if(input.newGroup) {
      const groupInput: GroupInput = {
        group: input.newGroup
      };
      this.groupRestApiService.addGroup(groupInput).subscribe({
        next: (data) => {
          if (input.newSubGroup) {
            const subGroupInput: SubGroupInput = {
              subGroup: input.newSubGroup,
              parentGroup: data[0].groupName ?? ""
            }
            this.groupRestApiService.addSubGroup(subGroupInput).subscribe({
              next: (data) => {
                this.postArticle(input.newArticle);
              }
            })
          } else {
            this.postArticle(input.newArticle);
          }
        }
      })
    }
    else {
      this.postArticle(input.newArticle);
    }
  }

  postArticle(newArticle: Article) {
    this.articleRestApiService.addArticle(newArticle).subscribe((newArticles: Article[]) => {
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

