import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
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
  id: number = 0;
  recommendations: Product[] = [];
  recently: Product[] = [];
  related: Product[] = this.storage.ProductArray(2);
  desktop = false;

  constructor(private storage: ProductsService, public cart: CartService, private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document) { }

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

    //TODO - refactor this.
    if (this.product?.image?.split('/')[4] != undefined) {
      this.id = parseInt(this.product?.image?.split('/')[4]);
    }
    
  }

  expandImg() {
    const bg = this.document.getElementById('full_size') as HTMLDivElement;
    bg.style.display = 'flex';
    this.document.body.style.overflow = 'hidden';

    bg.onclick = () => {
      bg.style.display = 'none';
      this.document.body.style.overflow = 'auto';
    };
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
