import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

enum ReviewStatus {
  Pending = 'pending',
  Approve = 'approve',
  Reject = 'reject',
}

@Component({
  selector: 'app-review-status',
  templateUrl: './review-status.component.html',
  styleUrls: ['./review-status.component.scss'],
  imports: [MatIconModule],
})
export class ReviewStatusComponent implements OnInit {
  @Input() status: string = '';
  ReviewStatus = ReviewStatus;
  constructor() {}

  ngOnInit() {}
}
