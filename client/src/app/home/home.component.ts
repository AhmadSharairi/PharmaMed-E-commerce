import { Component } from '@angular/core';
import { ShopService } from '../shop/shop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  products: any[] = [];

  constructor( private shopService: ShopService , private router : Router) { }

  ngOnInit() {

    this.getProducts(true);

  }


  getProducts(useCache = false) {

    this.shopService.getProducts(useCache).subscribe((response) => {
      this.products = response.data;

    });
  }

  navigateToShopPage()
  {
    this.router.navigate(['/shop']);
  }


}
