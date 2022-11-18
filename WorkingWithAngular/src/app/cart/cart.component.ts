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
  recomLine: Product[] = [];
  product = <any>{};
  recently: Product[] = this.productServ.ProductArray(10);
  index = 0;

  constructor(private cart: CartService, private productServ: ProductsService, @Inject(DOCUMENT) private document: Document) {
    this.productServ.recommended.subscribe((value: Product[]) => { this.recommendations = value })
    //for (let i = 0; i < 10; i++) {
    //  this.recomLine.push(this.recommendations[i]);
    //}
    this.product = this.recommendations[this.index];
    if (this.product === undefined) {
      this.productServ.single.subscribe((value: Product) => this.product = value);
    }
  }

  ngAfterViewInit(): void {
    window.addEventListener("resize", function () {
    });
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

  leftSwipe() {
    if (this.index > 0) {
      this.index--;
      this.product = this.recommendations[this.index];
    }
  }

  rightSwipe() {
    if (this.index < this.recommendations.length - 1) {
      this.index++;
      this.product = this.recommendations[this.index];
    }
  }
}
