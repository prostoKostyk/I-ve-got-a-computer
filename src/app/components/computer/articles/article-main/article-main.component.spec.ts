import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleMainComponent } from './article-main.component';

describe('ArticleMainComponent', () => {
  let component: ArticleMainComponent;
  let fixture: ComponentFixture<ArticleMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
