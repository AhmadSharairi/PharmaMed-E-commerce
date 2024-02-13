import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';
import { LoaderService } from './core/services/loader.service';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';
import { ShopService } from './shop/shop.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'PharmaMed';

  constructor(
    private basketService: BasketService,
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef ,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();

  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
      this.accountService.loadCurrentUser(token).subscribe( ()=>
         {
          console.log('Loaded User');
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        (error) => {
          console.log('Error loading user' );
          console.log(error);
        }
      );

  }



  loadBasket() {
    // Retrieve the basket_id from local storage
    const basketId = localStorage.getItem('basket_id');

    // Check if a basket_id is present
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe(
        // Success callback
        (basket) => {
          console.log('Initialized basket', basket);
        },
        // Error callback
        (error) => {
          console.log('Error initializing basket', error);
        }
      );
    }
  }

}
