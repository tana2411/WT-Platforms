import { Component, computed, effect, EventEmitter, HostListener, Input, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  imports: [MatButtonModule, MatIconModule],
})
export class PaginationComponent implements OnInit {
  @Input() set pageNumber(val: number) {
    this.pageNumber$.set(val);
  }
  @Input() set totalCount(val: number) {
    this.totalCount$.set(val);
  }
  @Input() size: number = 10;
  @Output() pageChange = new EventEmitter();

  pages = signal<number[]>([]);
  isMobile = signal(false);
  totalCount$ = signal(0);
  pageNumber$ = signal(0);

  constructor() {
    effect(() => {
      this.updatePages();
    });
  }

  ngOnInit() {
    this.updatePages();
    this.checkMobile();
  }

  totalPage = computed(() => Math.ceil(this.totalCount$() / this.size));

  private updatePages(): void {
    const pages: number[] = [];
    const maxButtonsToShow = this.isMobile() ? 3 : 5;

    if (this.totalPage() === 0) {
      this.pages.set([]);
      return;
    }

    if (this.totalPage() <= maxButtonsToShow) {
      for (let i = 1; i <= this.totalPage(); i++) {
        pages.push(i);
      }
    } else {
      let startPage: number;

      if (this.pageNumber$() <= Math.ceil(maxButtonsToShow / 2)) {
        startPage = 1;
      } else if (this.pageNumber$() + Math.floor(maxButtonsToShow / 2) >= this.totalPage()) {
        startPage = this.totalPage() - maxButtonsToShow + 1;
      } else {
        startPage = this.pageNumber$() - Math.floor(maxButtonsToShow / 2);
      }

      for (let i = 0; i < maxButtonsToShow; i++) {
        pages.push(startPage + i);
      }
    }
    this.pages.set(pages);
  }

  onPageButtonClick(page: number): void {
    if (page >= 1 && page <= this.totalPage()) {
      this.pageChange.emit(page);
    }
  }

  onPreviousPage(): void {
    if (this.pageNumber$() > 1) {
      this.pageChange.emit(this.pageNumber$() - 1);
      this.updatePages();
    }
  }

  onNextPage(): void {
    if (this.pageNumber$() < this.totalPage()) {
      this.pageChange.emit(this.pageNumber$() + 1);
      this.updatePages();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  private checkMobile() {
    this.isMobile.set(window.innerWidth < 768);
  }
}
