import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketItem, IBasketTotals } from 'src/app/shared/models/basket';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss'],
})
export class OrderDetailedComponent implements OnInit {
  orders: Order;
  basketTotal: IBasketTotals;
  basketItems$: Observable<IBasketItem>;
  discount: number = 0;
  tax: number = 0;

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private orderService: OrdersService,
    private basketService: BasketService,
    private spinner: NgxSpinnerService
  ) {
    this.breadcrumbService.set('@OrderDetailed', '');
    basketService.basketTotal$.subscribe((value) => {
      this.discount = value.discount;
      this.tax = value.tax;

    });

  }

  ngOnInit() {
    this.getOrderDetails();
  }


  getOrderDetails()
  {
    this.spinner.show();
    const id = this.route.snapshot.paramMap.get('id'); // get snapshot from url to get user id 
    id &&  this.orderService.getOrderDetailed(+id).subscribe({
        next: (order: Order) => {
          this.orders = order;
          this.breadcrumbService.set(
            '@OrderDetailed',
            `Order Number ${order.id} - ${order.status}`
          );

          this.spinner.hide();
        },

        error: (err: any) => {
          this.spinner.hide();
          console.error('Error fetching order details:', err);
        },
      });
  }

}
