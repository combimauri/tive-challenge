import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { User } from '../../core/models/user.model';

@Component({
  selector: 'tive-ranking-table',
  templateUrl: './ranking-table.component.html',
  styleUrls: ['./ranking-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingTableComponent {
  @Input() data: User[] = [];
  @Input() dbHasMoreItems = false;
  @Input() currentPageNumber = 1;
  @Input() pageSize = 10;
  @Input() highlightedId = '';
  @Output() goToPreviousPage = new EventEmitter<void>();
  @Output() goToNextPage = new EventEmitter<void>();
  @Output() navigateToItemProfile = new EventEmitter<string>();
}
