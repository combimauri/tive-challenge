import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import { UserResponse } from '../../core/models/user-response.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'tive-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  globalRankingResponse$: Observable<UserResponse> = of();

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  goToPreviousPage(pageNumber: number): void {
    if (pageNumber > 1) {
      this.setGlobalRanking(pageNumber - 1);
    }
  }

  goToNextPage(dbHasMoreItems: boolean, pageNumber: number): void {
    if (dbHasMoreItems) {
      this.setGlobalRanking(pageNumber + 1);
    }
  }

  navigateToItemProfile(userId: string): void {
    this.router.navigate(['/users', userId]);
  }

  private loadInitialData(): void {
    this.setGlobalRanking();
  }

  private setGlobalRanking(page = 1): void {
    this.globalRankingResponse$ = this.userService.getUsers({
      page,
    });
  }
}
