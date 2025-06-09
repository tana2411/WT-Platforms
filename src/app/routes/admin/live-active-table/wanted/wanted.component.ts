import { Component, OnInit } from '@angular/core';
import { ListContainerComponent, PageResult } from 'app/share/ui/list-container/list-container.component';
import { Observable, of } from 'rxjs';
import { WantedDetailComponent } from './wanted-detail/wanted-detail.component';

@Component({
  selector: 'app-wanted',
  templateUrl: './wanted.component.html',
  styleUrls: ['./wanted.component.scss'],
  imports: [ListContainerComponent, WantedDetailComponent],
})
export class WantedComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  mockItem(filter: any): Observable<PageResult> {
    const result: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const totalCount = result.length;
    return of({ results: result, totalCount });
  }
}
