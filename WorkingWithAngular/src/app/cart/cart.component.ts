import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items = this.cart.getItems();
  recommended = this.productServ.ProductArray(10);
  product: any;

  constructor(private cart: CartService, private productServ: ProductsService) {
    this.recommended.forEach(value => {
      this.product = value;
    })
  }


  ngOnInit(): void {
  }

  removeFromCart(product: Product) {
    this.cart.removeItem(product);
  }
}
