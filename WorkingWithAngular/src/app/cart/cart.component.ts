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
  product = <any>{};

  constructor(private cart: CartService, private productServ: ProductsService) {
    //this.product = productServ.products[Math.floor(Math.random() * productServ.products.length)];
    this.productServ.single.subscribe((value: Product) => this.product = value);
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
    this.productServ.SingleProduct();
  }

  rightSwipe() {
    this.productServ.SingleProduct();
  }
}
