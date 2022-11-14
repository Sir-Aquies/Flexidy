import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductsArray, Product } from '../Products';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css', '../products-list/products-list.component.css']
})
export class CartComponent implements OnInit {

  items = this.cart.getItems();

  constructor(private cart: CartService) { }

  ngOnInit(): void {
  }

  removeFromCart(product: Product) {
    let index = this.items.indexOf(product);
    this.items.splice(index, 1);
  }

}
