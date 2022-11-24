import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { ProductsService, Product } from '../products.service';


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit, AfterViewInit {
  product: Product | undefined;
  recommendations: Product[] = [];
  recently: Product[] = [];
  related: Product[] = this.storage.ProductArray(2);
  desktop = false;

  constructor(private storage: ProductsService, public cart: CartService, private route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.storage.recommended.subscribe((value: Product[]) => { this.recommendations = value });
    this.storage.recently.subscribe((value: Product[]) => { this.recently = value });
    
  }

  ngOnInit(): void {
    this.desktop = window.innerWidth > 840 ? true : false;

    this.route.params.subscribe(
      params => {
        const id = params['productName'];
        this.getProduct(id);
      }
    );
  }

  getProduct(productName: string) {
    this.product = this.storage.products.find(pro => pro.name === productName);

    if (this.product === undefined) {
      this.product = this.storage.recommended.value.find(pro => pro.name === productName);
    }

    if (this.product === undefined) {
      this.product = this.storage.recently.value.find(pro => pro.name === productName);
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
