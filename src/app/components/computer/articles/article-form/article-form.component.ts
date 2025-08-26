import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, Group, SubGroup} from "../../../../models/common";

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.less'
})
export class ArticleFormComponent {
  newArticle: Article = { title: '', content: '', group: '', subGroup: '', imageUrls: [] };
  imageUrlString: string = '';
  newGroupName: string = '';
  newSubGroupName: string = '';
  @Input() availableGroups: Group[];
  @Input() availableSubGroups: SubGroup[];
  @Output() articleAdded = new EventEmitter<Article>();

  addArticle() {
    if (this.newArticle.group === '' && this.newGroupName) {
      this.newArticle.group = this.newGroupName;
    }
    if (this.newArticle.subGroup === '' && this.newSubGroupName) {
      this.newArticle.subGroup = this.newSubGroupName;
    }
    this.newArticle.imageUrls = this.imageUrlString.split(',').map(url => url.trim()).filter(url => url !== '');
    this.articleAdded.emit(this.newArticle);
    this.newArticle = { title: '', content: '', group: '', subGroup: '', imageUrls: [] };
    this.imageUrlString = '';
    this.newGroupName = '';
    this.newSubGroupName = '';
  }
}
