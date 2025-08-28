import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Article, Group, SubGroup} from "../../../../models/common";

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.less'
})
export class ArticleFormComponent {
  newArticle: Article = { title: '', content: '', group: '', subGroup: '', imageUrls: [], order: 999999999999999};
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
      this.newArticle.order = 1;
    } else {
      const subGroup = this.availableSubGroups.find(sb => sb.articles.findIndex(sb2 => sb2.subGroup === this.newArticle.subGroup) > -1);
      this.newArticle.order = (subGroup?.articles.length || 999999999999999) + 1;
    }
    this.newArticle.imageUrls = this.imageUrlString.split(',').map(url => url.trim()).filter(url => url !== '');
    this.articleAdded.emit(this.newArticle);
    this.newArticle = { title: '', content: '', group: '', subGroup: '', imageUrls: [], order: 999999999999999};
    this.imageUrlString = '';
    this.newGroupName = '';
    this.newSubGroupName = '';
  }
}
