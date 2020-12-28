import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { RankingParams } from '../models/ranking-params.model';
import { User } from '../models/user.model';
import { UserResponse } from '../models/user-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers({
    userId,
    page,
    filterBy,
  }: RankingParams): Observable<UserResponse> {
    let url = `${environment.apiBasePath}getUsers?`;

    if (page) {
      url += `page=${page}&`;
    }

    if (userId) {
      url += `userId=${userId}&`;

      if (filterBy) {
        url += `filterBy=${filterBy}`;
      }
    }

    return this.http.get<UserResponse>(url);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(
      `${environment.apiBasePath}getUser?userId=${userId}`
    );
  }
}
