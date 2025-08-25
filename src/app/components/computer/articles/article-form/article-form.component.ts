import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, Group} from "../../../../models/common";

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.less'
})
export class ArticleFormComponent {
  newArticle: Article = { title: '', content: '', group: '', imageUrls: [] };
  imageUrlString: string = '';
  newGroupName: string = '';
  @Input() availableGroups: Group[];
  @Output() articleAdded = new EventEmitter<Article>();

  addArticle() {
    if (this.newArticle.group === '' && this.newGroupName) {
      this.newArticle.group = this.newGroupName;
    }
    this.newArticle.imageUrls = this.imageUrlString.split(',').map(url => url.trim()).filter(url => url !== '');
    this.articleAdded.emit(this.newArticle);
    this.newArticle = { title: '', content: '', group: '', imageUrls: [] };
    this.imageUrlString = '';
    this.newGroupName = '';
  }
}
