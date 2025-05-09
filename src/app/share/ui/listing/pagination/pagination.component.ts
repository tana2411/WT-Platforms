import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  imports: [MatButtonModule, MatIconModule],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pageNumber: number = 0;
  @Input() totalPage: number = 0;
  @Output() pageChange = new EventEmitter();
  pages: number[] = [];

  constructor() {}

  ngOnInit() {
    this.updatePages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageNumber'] || changes['totalPage']) {
      this.updatePages();
    }
  }

  private updatePages(): void {
    const pages: number[] = [];
    const maxButtonsToShow = 5;

    if (this.totalPage === 0) {
      this.pages = [];
      return;
    }

    if (this.totalPage <= maxButtonsToShow) {
      for (let i = 1; i <= this.totalPage; i++) {
        pages.push(i);
      }
    } else {
      let startPage: number;

      if (this.pageNumber <= Math.ceil(maxButtonsToShow / 2)) {
        startPage = 1;
      } else if (
        this.pageNumber + Math.floor(maxButtonsToShow / 2) >=
        this.totalPage
      ) {
        startPage = this.totalPage - maxButtonsToShow + 1;
      } else {
        startPage = this.pageNumber - Math.floor(maxButtonsToShow / 2);
      }

      for (let i = 0; i < maxButtonsToShow; i++) {
        pages.push(startPage + i);
      }
    }
    this.pages = pages;
  }

  onPageButtonClick(page: number): void {
    if (page >= 1 && page <= this.totalPage) {
      this.pageNumber = page;
      this.pageChange.emit(page);
      this.updatePages();
    }
  }

  onPreviousPage(): void {
    if (this.pageNumber > 1) {
      this.pageChange.emit(this.pageNumber - 1);
      this.pageNumber = this.pageNumber - 1;
      this.updatePages();
    }
  }

  onNextPage(): void {
    if (this.pageNumber < this.totalPage) {
      this.pageChange.emit(this.pageNumber + 1);
      this.pageNumber = this.pageNumber + 1;
      this.updatePages();
    }
  }
}
