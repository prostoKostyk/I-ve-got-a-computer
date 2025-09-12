import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Article, User} from "../models/common";

@Injectable({
  providedIn: "root"
})

export class RestApiService {

  private apiUrl = "https://users-93fb.restdb.io";
  private usersUrl = "/rest/gameusers"
  private articlesUrl = "/rest/articles";
  private articlesUrlWithMeta = "/rest/articles?metafields=true";
  constructor(private httpClient: HttpClient) {
  }

  public getUsers<T>(): Observable<T> {
    return this.httpClient.get<T>(this.apiUrl + this.usersUrl, { headers: this.initHeaders() });
  }

  public addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.apiUrl + this.usersUrl, user, { headers: this.initHeaders() })
  }

  private initHeaders(): HttpHeaders {
    return new HttpHeaders().append("Content-Type", "application/json").append("x-apikey", "684a9e12bb5ccc1033f6d8d0").append("cache-control", "no-cache");
  }

  registerUser(userName: string): Observable<any> {
    return this.httpClient.post<any>("https://users-93fb.restdb.io/views/api/register", { name: userName }, { headers: this.initHeaders() });
  }

  loginUser(userName: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/api/loginUser`, { name: userName }, { headers: this.initHeaders() });
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  getUserName(): string | null{
    return localStorage.getItem('userName');
  }
  setUserName(userName: string): void{
    localStorage.setItem('userName', userName);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  public getArticles<T>(): Observable<T> {
    return this.httpClient.get<T>(this.apiUrl + this.articlesUrlWithMeta, { headers: this.initHeaders() });
  }

  public addArticle(article: Article): Observable<Article> {
    return this.httpClient.post<Article>(this.apiUrl + this.articlesUrl, article, { headers: this.initHeaders() });
  }

  public deleteArticle(articleId: string): Observable<any> {
    const url = `${this.apiUrl}${this.articlesUrl}/${articleId}`;
    return this.httpClient.delete(url, { headers: this.initHeaders() });
  }

  public updateArticle(article: Article): Observable<any> {
    const url = `${this.apiUrl}${this.articlesUrl}/${article._id}`;
    return this.httpClient.put(url, article, { headers: this.initHeaders() });
  }
}
