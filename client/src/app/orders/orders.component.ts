import { Component, OnInit } from '@angular/core';
import { Order } from '../shared/models/order';
import { OrdersService } from './orders.service';
import { Router } from '@angular/router';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: Order[]= [];
  noOrdersFound:boolean = false;
  isLoaded: boolean = false;

  orderTotal:number =0 ;


  ngOnInit() {
    this.getOrders();
  }

  constructor(private ordersService: OrdersService ,
              private router: Router ,
              private spinner : NgxSpinnerService)
              {}


  getOrders()
   {
    this.spinner.show();
    this.ordersService.getOrders().subscribe(

      (orders: Order[]) => {
        this.orders = this.sortOrdersByDate(orders);
        this.noOrdersFound = orders.length === 0;
        this.isLoaded = true;
        this.spinner.hide();
      },
      (error: any) => {
        console.log(error);
        this.spinner.hide();

      }
    );
  }

  private sortOrdersByDate(orders: Order[]): Order[] { // FROM OLD TO NEW DATE
    return orders.sort((a, b) => {
      const dateA = new Date(a.orderTime).getTime();
      const dateB = new Date(b.orderTime).getTime();
      return dateA - dateB;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'text-warning';
      case 'Delivered':
        return 'text-success';
      case 'Shipped':
        return 'text-info';
      case 'Payment Receive':
        return 'text-primary';
      case 'Payment Failed':
        return 'text-danger';
      default:
        return '';
    }
  }


  navigateToShop() {
    this.router.navigate(['/shop']);
  }

  refreshList(): void {
    this.isLoaded = false;
    this.getOrders();
  }}
