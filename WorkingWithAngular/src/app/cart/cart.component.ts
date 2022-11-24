import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterViewInit {

  items = this.cart.getItems();
  recommendations: Product[] = [];
  recently: Product[] = [];
  related: Product[] = this.storage.ProductArray(2);
  desktop = false;

  //create a explore component/page for shearching images depending on size.

  constructor(public cart: CartService, private storage: ProductsService) {
  }

  ngAfterViewInit(): void {
    this.storage.recommended.subscribe((value: Product[]) => { this.recommendations = value });

    this.storage.recently.subscribe((value: Product[]) => { this.recently = value });

    //window.addEventListener('resize', () => {
    //  this.desktopCheck();
    //});
  }

  ngOnInit(): void {
    this.desktop = window.innerWidth > 840 ? true : false;
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
