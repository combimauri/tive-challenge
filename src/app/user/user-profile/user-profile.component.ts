import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RankingParams } from '../../core/models/ranking-params.model';
import { User } from '../../core/models/user.model';
import { UserResponse } from '../../core/models/user-response.model';
import { UserService } from '../../core/services/user.service';

enum RankingType {
  GLOBAL = 'global',
  COUNTRY = 'country',
  FRIENDS = 'friends',
}

interface RankingResponse {
  title?: string;
  response: Observable<UserResponse>;
}

@Component({
  selector: 'tive-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userId = '';
  currentUser$: Observable<User> = of();
  rankingRecords: Record<RankingType, RankingResponse> = {
    [RankingType.GLOBAL]: { response: of() },
    [RankingType.COUNTRY]: { response: of() },
    [RankingType.FRIENDS]: { response: of() },
  };

  readonly TIME_TO_LEVEL_UP = 28800; // Represents 8 hours in seconds

  private componentDestroyed$ = new Subject<void>();

  get rankingRecordsKeys(): RankingType[] {
    return Object.keys(this.rankingRecords) as RankingType[];
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  goToPreviousPage(pageNumber: number, rankingType: RankingType): void {
    if (pageNumber > 1) {
      this.rankingRecords[rankingType].response = this.userService.getUsers(
        this.buildRankingResponseParams(pageNumber, -1, rankingType)
      );
    }
  }

  goToNextPage(
    dbHasMoreItems: boolean,
    pageNumber: number,
    rankingType: RankingType
  ): void {
    if (dbHasMoreItems) {
      this.rankingRecords[rankingType].response = this.userService.getUsers(
        this.buildRankingResponseParams(pageNumber, +1, rankingType)
      );
    }
  }

  navigateToItemProfile(userId: string): void {
    this.router.navigate(['/users', userId]);
  }

  private loadInitialData(): void {
    this.route.params
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(({ userId }) => {
        if (userId) {
          this.userId = userId;

          this.loadUserData();
        }
      });
  }

  private loadUserData(): void {
    const { userId } = this;
    this.currentUser$ = this.userService.getUser(userId);
    this.rankingRecords = {
      [RankingType.GLOBAL]: {
        title: 'Global Ranking',
        response: this.userService.getUsers({
          userId,
        }),
      },
      [RankingType.COUNTRY]: {
        title: 'National Ranking',
        response: this.userService.getUsers({
          userId,
          filterBy: 'country',
        }),
      },
      [RankingType.FRIENDS]: {
        title: 'Friends Ranking',
        response: this.userService.getUsers({
          userId,
          filterBy: 'friends',
        }),
      },
    };
  }

  private buildRankingResponseParams(
    pageNumber: number,
    pageFactor: 1 | -1,
    rankingType: RankingType
  ): RankingParams {
    const { userId } = this;
    const page = pageNumber + pageFactor;
    const filterBy = rankingType;
    const params: RankingParams = { userId, page };

    if (filterBy !== 'global') {
      params.filterBy = filterBy;
    }

    return params;
  }
}
