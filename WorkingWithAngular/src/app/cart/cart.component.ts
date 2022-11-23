import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
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
  related: Product[] = this.productServ.ProductArray(2);
  desktop = false;

  //make a refresh button for product-list.
  //create a explore component/page for shearching images depending on size.
  //Create a product-details component/page to show a single product.

  constructor(public cart: CartService, private productServ: ProductsService) {
  }

  ngAfterViewInit(): void {
    this.productServ.recommended.subscribe((value: Product[]) => { this.recommendations = value });

    this.productServ.recently.subscribe((value: Product[]) => { this.recently = value });

    //window.addEventListener('resize', () => {
    //  this.desktopCheck();
    //});

    this.desktopCheck();
  }

  desktopCheck() {
    if (window.innerWidth > 840) {
      this.desktop = true;
    }
    else {
      this.desktop = false;
    }
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
