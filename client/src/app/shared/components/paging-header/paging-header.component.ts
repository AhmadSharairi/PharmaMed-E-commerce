import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss']
})
export class PagingHeaderComponent implements OnInit{
@Input() pageNumber: number;
@Input() pageNumItems: number;
@Input() totalCountProducts: number;


@Input() loadingFinished: boolean;
  constructor() {}

  ngOnInit() {

  }

}
