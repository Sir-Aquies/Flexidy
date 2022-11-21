import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductsService, Product } from '../products.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterViewInit {

  items = this.cart.getItems();
  recommendations: Product[] = [];

  recently: Product[] = this.productServ.ProductArray(6);

  //display the total cost of the cart
  //create footer component

  constructor(private cart: CartService, private productServ: ProductsService, @Inject(DOCUMENT) private document: Document) {
    this.productServ.recommended.subscribe((value: Product[]) => { this.recommendations = value });
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
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
