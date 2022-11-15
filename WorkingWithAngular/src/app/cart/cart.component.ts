import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css', '../products-list/products-list.component.css']
})
export class CartComponent implements OnInit {

  items = this.cart.getItems();

  //TODO - show more items with ProductArray.

  constructor(private cart: CartService, private products: ProductsService) { }

  ngOnInit(): void {
  }

  removeFromCart(product: Product) {
    this.cart.removeItem(product);
  }
}
