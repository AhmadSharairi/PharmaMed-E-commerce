import { Component, Input} from '@angular/core';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'total-summary',
  templateUrl: './total-summary.component.html',
  styleUrls: ['./total-summary.component.scss'],
})
export class TotalSummaryComponent {
  @Input() showPurchaseButtons: boolean = true;
  @Input() shipping: number = 0;
  @Input() discount: number = 0;
  @Input() tax: number = 0;
  @Input() subtotal: number = 0;
  @Input() total: number = 0;

  constructor(private router: Router) {}

  navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }

  navigateToShop() {
    this.router.navigate(['/shop']);
  }

  navigateToShopIfNoItems() {
    const warningMessage = 'No items in the basket to make a purchase!';
    Swal.fire({
      icon: 'warning',
      title: 'Basket Empty',
      text: warningMessage,
      position: 'center',
      showConfirmButton: false,
      timer: 2000,
      backdrop: 'rgba(0, 0, 0, 0.4)',
    });
  }
}
