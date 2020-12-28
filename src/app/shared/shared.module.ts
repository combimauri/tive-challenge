import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RankingTableComponent } from './ranking-table/ranking-table.component';

@NgModule({
  declarations: [RankingTableComponent],
  imports: [CommonModule],
  exports: [RankingTableComponent],
})
export class SharedModule {}
