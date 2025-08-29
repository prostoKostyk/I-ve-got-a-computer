import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSubGroupComponent } from './article-sub-group.component';

describe('ArticleSubGroupComponent', () => {
  let component: ArticleSubGroupComponent;
  let fixture: ComponentFixture<ArticleSubGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleSubGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleSubGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
