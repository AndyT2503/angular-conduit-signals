import { createInjectionToken, ObjectValues } from 'src/app/shared/utils';

export const ARTICLE_TYPE = {
  MyArticle: 'myArticle',
  FavoritedArticle: 'favoritedArticle',
} as const;

export type ArticleType = ObjectValues<typeof ARTICLE_TYPE>;

export const [injectArticleType, provideArticleType] =
  createInjectionToken<ArticleType>('Article Type');
