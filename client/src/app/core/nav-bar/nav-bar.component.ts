import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from './../../shared/models/basket';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/models/user';
import { AccountService } from 'src/app/account/account.service';
import { IBasketItem } from 'src/app/shared/models/basket';

@Component({
  selector: 'navbar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  basket$: Observable<IBasket>;
  currentUsers$: Observable<IUser>;
  chartItems:  number;

  constructor(
    public basketService: BasketService,
    public accountService: AccountService
  ) {}

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.currentUsers$ = this.accountService.currentUser$;
  }
  logout(){
    this.accountService.logout();
  }

  getCount(items: IBasketItem[]) {

    this.chartItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return this.chartItems;
  }


}
