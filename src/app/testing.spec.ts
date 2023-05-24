import { HttpClient } from '@angular/common/http';
import { Article, Comment, Profile } from './shared/models';

export function getSpyHttpClient(): jasmine.SpyObj<HttpClient> {
  return jasmine.createSpyObj<HttpClient>(HttpClient.name, [
    'get',
    'post',
    'put',
    'delete',
  ]);
}

export function getMockedProfile(profile?: Partial<Profile>): Profile {
  return {
    bio: 'test',
    following: true,
    image: 'test',
    username: 'test',
    ...profile,
  };
}

export function getMockedArticle(
  article?: Partial<Article>,
  author?: Partial<Profile>
): Article {
  return {
    author: getMockedProfile(author),
    body: 'test',
    createdAt: new Date().toISOString(),
    description: 'test',
    favorited: true,
    favoritesCount: 0,
    slug: 'slug',
    tagList: ['test1', 'test2'],
    title: 'title',
    updatedAt: new Date().toISOString(),
    ...article,
  };
}

export function getMockedComment(comment?: Comment, author?: Profile): Comment {
  return {
    author: getMockedProfile(author),
    body: 'body',
    createdAt: new Date().toISOString(),
    id: 'id',
    updatedAt: new Date().toISOString(),
    ...comment,
  };
}
