import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Article } from "../models/common";
import {API_DOMAIN, NODEJS_API_DOMAIN} from "../constants/constants";

@Injectable({
  providedIn: "root"
})

export class ArticleRestApiService {

  private domain = API_DOMAIN;
  private articlesPath = "/rest/articles";
  private articlePath = "/rest/article";
  private articlesPathWithMeta = "/rest/articles?metafields=true";

  constructor(private httpClient: HttpClient) {
  }

  private initHeaders(): HttpHeaders {
    return new HttpHeaders().append("Content-Type", "application/json").append("x-apikey", "684a9e12bb5ccc1033f6d8d0").append("cache-control", "no-cache");
  }

  public getArticles<T>(): Observable<T> {
    return this.httpClient.get<T>(this.domain + this.articlesPath, {headers: this.initHeaders()});
  }

  public addArticle(article: Article): Observable<Article[]> {
    return this.httpClient.post<Article[]>(this.domain + this.articlePath, article, {headers: this.initHeaders()});
  }

  public updateArticle(article: Article): Observable<any> {
    const url = `${this.domain}${this.articlePath}`;
    return this.httpClient.put(url, article, {headers: this.initHeaders()});
  }

  public deleteArticle(articleId: string): Observable<any> {
    const url = `${this.domain}${this.articlePath}/${articleId}`;
    return this.httpClient.delete(url, {headers: this.initHeaders()});
  }
}
