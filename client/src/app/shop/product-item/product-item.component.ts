import { Component, Input } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from './../shop.service';
import { BasketService } from './../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {

@Input() product: IProduct;
@Input() showProductInfo: boolean = true;
@Input() showReadMoreButtonInHomePage: boolean = false;
@Input() showReadMoreButtonInDetailsPage: boolean = false;
@Input() showAddButton: boolean = true;
@Input() productId: number;
//discountValue: number;


clicked:boolean= false;

description: any;

constructor(private shopService: ShopService ,
   private basketService: BasketService ,
    private toastr : ToastrService,
    private router:Router
    )  {
 // this.discountValue = shopService.discountValue();
}

Description(): any {
   this.description = this.product.description.slice(0,50);

  return  this.description + "..";

}

navigateToProductDetails(productId: number) {
  // Use the Angular Router to navigate to the same component with a different parameter
  this.router.navigate(['/shop', productId]);
}



addOneItemToBasket(product: IProduct) {
  const currentBasket = this.basketService.getCurrentBasketValue();

   if (!currentBasket) {

     // If the basket is null, create a new basket
     this.basketService.createAndInitializeBasket();
   }

   const basketItem = this.basketService.mapProductItemToBasketItem(product, 1);

   // Now that you've created a new basket if it was null, retrieve it again
   const updatedBasket = this.basketService.getCurrentBasketValue();

   // Check if the item is already in the basket
   const isItemInBasket = updatedBasket && updatedBasket.items.some((item) => item.id === basketItem.id);

   if (isItemInBasket) {
     // Display a warning message in the center of the screen
     Swal.fire({
      icon: 'warning',
      title: 'Item Already Added',
      text: 'This item is already in your basket.',
      position: 'center',
      showConfirmButton: false,
      timer: 1500, // Automatically closes after 1.5 seconds
      backdrop: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
      customClass: {
        // Add any custom classes here if needed
      },
    });


   } else {
     // Add the item to the basket and display a success message
     this.basketService.addItemToBasket(product);

     // Display a success message in the center of the screen
     Swal.fire({
       icon: 'success',
       title: 'Item Added to Basket',
       text: 'The item has been added to your basket.',
       position: 'center',
       showConfirmButton: false,
       timer: 1000, // Automatically close after 2 seconds
     });
   }
 }

 }

