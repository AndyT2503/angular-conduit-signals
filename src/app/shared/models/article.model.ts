export interface ArticleAPIResponse {
  article: Article;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}

interface Author {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}
