import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { __values } from 'tslib';
import { CartService } from '../cart.service';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  //TODO -  add pagination.
  products = this.storage.products;

  constructor(public cart: CartService, private storage: ProductsService) {}

  ngOnInit(): void {
  }

  refreshList() {
    let amount = document.getElementById('product_amount') as HTMLSelectElement;
    if (amount) {
      this.storage.fillArray(parseInt(amount.value));
      this.products = this.storage.products;
    }
  }

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

  removeFromCart(product: Product) {
    this.cart.removeItem(product);
  }
}
