import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { getMockedArticle, getSpyHttpClient } from 'src/app/testing.spec';
import { ArticleService, UpsertArticleBodyRequest } from './article.service';

describe(ArticleService.name, () => {
  function setup() {
    const spyHttpClient = getSpyHttpClient();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ArticleService,
        {
          provide: HttpClient,
          useValue: spyHttpClient,
        },
      ],
    });

    const articleService = TestBed.inject(ArticleService);
    return { spyHttpClient, articleService };
  }

  it('should return new Article when invoke createArticle', (done) => {
    const { spyHttpClient, articleService } = setup();
    const mockedData = {
      article: getMockedArticle(),
    };
    spyHttpClient.post.and.returnValue(of(mockedData));
    articleService.createArticle({} as UpsertArticleBodyRequest).subscribe({
      next: (value) => {
        expect(value).toEqual(mockedData);
        done();
      },
      error: () => {
        done.fail();
      },
    });
  });

  it('should return update Article when invoke updateArticle', (done) => {
    const { spyHttpClient, articleService } = setup();
    const mockedData = {
      article: getMockedArticle(),
    };
    spyHttpClient.put.and.returnValue(of(mockedData));
    articleService.updateArticle('', {} as UpsertArticleBodyRequest).subscribe({
      next: (value) => {
        expect(value).toEqual(mockedData);
        done();
      },
      error: () => {
        done.fail();
      },
    });
  });
});
