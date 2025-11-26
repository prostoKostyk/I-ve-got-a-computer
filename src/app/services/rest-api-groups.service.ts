import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Article, SubGroup} from "../models/common";
import {API_DOMAIN, NODEJS_API_DOMAIN} from "../constants/constants";

@Injectable({
  providedIn: "root"
})

export class GroupRestApiService {

  private domain = API_DOMAIN;
  private groupsPath = "/rest/groups";
  private groupPath = "/rest/group";
  private groupWithArticlesPath = "/rest/groupswitharticles";
  private subGroupsPath = "/rest/subgroups";
  private subGroupsWithArticlesPath = "/rest/subgroupswitharticles";
  private subGroupPath = "/rest/subgroup";

  constructor(private httpClient: HttpClient) {
  }

  private initHeaders(): HttpHeaders {
    return new HttpHeaders().append("Content-Type", "application/json").append("x-apikey", "684a9e12bb5ccc1033f6d8d0").append("cache-control", "no-cache");
  }

  public getGroups<T>(): Observable<T> {
    return this.httpClient.get<T>(this.domain + this.groupsPath, {headers: this.initHeaders()});
  }

  public getGroupsWithArticles<T>(): Observable<T> {
    return this.httpClient.get<T>(this.domain + this.groupWithArticlesPath, {headers: this.initHeaders()});
  }

  public addGroup(article: Article): Observable<Article[]> {
    return this.httpClient.post<Article[]>(this.domain + this.groupPath, article, {headers: this.initHeaders()});
  }

  public getSubGroups(): Observable<SubGroup[]> {
    return this.httpClient.get<SubGroup[]>(this.domain + this.subGroupsPath, {headers: this.initHeaders()});
  }

  public getSubGroupsWithArticles(): Observable<SubGroup[]> {
    return this.httpClient.get<SubGroup[]>(this.domain + this.subGroupsWithArticlesPath, {headers: this.initHeaders()});
  }

  public addSubGroup(article: Article): Observable<Article[]> {
    return this.httpClient.post<Article[]>(this.domain + this.subGroupPath, article, {headers: this.initHeaders()});
  }
}
