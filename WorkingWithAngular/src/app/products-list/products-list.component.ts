import { Component, OnInit } from '@angular/core';
import { ProductsArray, Product } from '../Products';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  products = ProductsArray(20);
  //TODO -  add pagination.
  constructor(private cart: CartService) { }

  ngOnInit(): void { }

  addToCart(product: Product) {
    let add = true;
    this.cart.items.forEach(function (value) {
      if (value.uid === product.uid) {
        add = false;
      }
    });

    if (add) {
      this.cart.addItem(product);
    }
  }

}
