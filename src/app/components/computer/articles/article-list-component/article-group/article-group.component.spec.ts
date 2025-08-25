import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleGroupComponent } from './article-group.component';

describe('ArticleGroupComponent', () => {
  let component: ArticleGroupComponent;
  let fixture: ComponentFixture<ArticleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
