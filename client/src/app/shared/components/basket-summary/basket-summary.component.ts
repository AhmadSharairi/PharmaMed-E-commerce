import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem, IBasketTotals } from '../../models/basket';
import { BasketService } from 'src/app/basket/basket.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss'],
})
export class BasketSummaryComponent {
 @Input() isBasket = true;
  noBasket = false;
  basket$: Observable<IBasket>;
  basket: IBasket;


  basketTotalSumm$: Observable<IBasketTotals>;



  basketTotal: Observable<IBasketTotals>;

  selectedValue: number = 1;
  totalPrice: number[] = [];
  total: number = 0;
  selectedValues: number[] = [];
  quantity: number = 0;

  ngOnInit() {
    this.spinner.show();
    this.loadBasketData();
  }

  constructor(
    private basketService: BasketService,
    private spinner: NgxSpinnerService,
    private router: Router ,
  ) {
    this.spinner.show();
    this.basketTotalSumm$ = this.basketService.basketTotal$;
    this.noBasket = false;
  }

  private loadBasketData() {
    this.basket$ = this.basketService.basket$;
    this.basket$.subscribe((basket) => {
      if (basket && basket.items.length > 0) {
        this.noBasket = false;

      } else {
        this.noBasket = true;

      }
      this.spinner.hide();
    });
  }

  removeBasketItem(item: IBasketItem) {
    const basket = this.basketService.getCurrentBasketValue();
    const isLastItem = basket.items.length === 1;

    if (isLastItem) {
      this.basketService.removeAllItemsFromBasket();
    } else {
      this.basketService.removeItemFromBasket(item);
    }
  }

  incrementItemQuantity(item: IBasketItem) {
    if (item.quantity < 10) {
      this.quantity++;
      this.basketService.incrementItemQuantity(item);
    }
  }

  decrementItemQuantity(item: IBasketItem) {
    if (item.quantity > 1) {
      this.quantity--;

      this.basketService.decrementItemQuantity(item);
    }
  }

  navigateToProductDetails(productId: number) {
    this.router.navigate(['/shop', productId]);
  }
  navigateToShop() {
    this.router.navigate(['/shop']);
  }

  async removeAllItems() {
    const result = await Swal.fire({
      title: 'Clear Cart?',
      text: 'Are you sure you want to remove all items from your shopping cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Clear Cart',
    });

    if (result.isConfirmed) {
      // Call the basket service to remove all items
      this.basketService.removeAllItemsFromBasket();

      // Display a success message
      await Swal.fire({
        icon: 'success',
        title: 'Cart Cleared!',
        text: 'All items have been successfully removed from your shopping cart.',
        position: 'center',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
}
