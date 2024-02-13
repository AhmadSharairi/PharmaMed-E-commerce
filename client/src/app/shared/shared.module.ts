import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { LoaderService } from '../core/services/loader.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TotalSummaryComponent } from './components/total-summary/total-summary.component';
import { BasketSummaryComponent } from './components/basket-summary/basket-summary.component';



@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagerComponent,
    ProgressSpinnerComponent,
    TotalSummaryComponent,
    BasketSummaryComponent




  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule ,
    FormsModule


  ],
  providers: [LoaderService],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    ProgressSpinnerComponent,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
    TotalSummaryComponent,
    BasketSummaryComponent ,

  ],
})
export class SharedModule {}
