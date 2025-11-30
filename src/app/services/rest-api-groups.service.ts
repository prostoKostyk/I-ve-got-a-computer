import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Article, Group, GroupInput, SubGroup, SubGroupInput} from "../models/common";
import {API_DOMAIN, NODEJS_API_DOMAIN} from "../constants/constants";

@Injectable({
  providedIn: "root"
})

export class GroupRestApiService {

  private domain = "http://localhost:3000";
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

  public addGroup(groupInput: GroupInput): Observable<Group[]> {
    return this.httpClient.post<Group[]>(this.domain + this.groupPath, groupInput, {headers: this.initHeaders()});
  }

  public getSubGroups(): Observable<SubGroup[]> {
    return this.httpClient.get<SubGroup[]>(this.domain + this.subGroupsPath, {headers: this.initHeaders()});
  }

  public getSubGroupsWithArticles(): Observable<SubGroup[]> {
    return this.httpClient.get<SubGroup[]>(this.domain + this.subGroupsWithArticlesPath, {headers: this.initHeaders()});
  }

  public addSubGroup(subGroupInput: SubGroupInput): Observable<SubGroupInput[]> {
    return this.httpClient.post<SubGroupInput[]>(this.domain + this.subGroupPath, subGroupInput, {headers: this.initHeaders()});
  }
}
