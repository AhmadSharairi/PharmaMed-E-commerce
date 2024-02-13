import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private totalRequests = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  setLoading(loading: boolean) {
    if (loading) {
      this.incrementTotalRequests();
      this.showSpinnerIfFirstRequest();
    } else {
      this.decrementTotalRequests();
      this.hideSpinnerIfNoRequests();
    }
  }


  getLoading(): boolean {
    return this.totalRequests > 0;
  }

  private incrementTotalRequests() {
    this.totalRequests++;
  }

  private decrementTotalRequests() {
    if (this.totalRequests > 0) {
      this.totalRequests--;
    }
  }

  private showSpinnerIfFirstRequest() {
    if (this.totalRequests === 1) {
      this.spinnerService.show();
    }
  }

  private hideSpinnerIfNoRequests() {
    if (this.totalRequests <= 0) {
      this.totalRequests = 0;
      this.spinnerService.hide();
    }
  }
}
