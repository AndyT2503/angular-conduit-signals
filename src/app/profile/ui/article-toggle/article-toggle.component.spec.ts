import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleToggleComponent } from './article-toggle.component';

describe('ArticleToggleComponent', () => {
  let component: ArticleToggleComponent;
  let fixture: ComponentFixture<ArticleToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleToggleComponent]
    });
    fixture = TestBed.createComponent(ArticleToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
