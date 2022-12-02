import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { ProductsService, Product, Size } from '../products.service';


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit, AfterViewInit {
  product: Product | undefined;
  id: number = 0;
  width = 0;
  height = 0;
  expandWidth = 0;
  expandHeight = 0;
  recommendations: Product[] = [];
  recently: Product[] = [];
  related: Product[] = this.storage.ProductArray(2);
  desktop = false;

  constructor(private storage: ProductsService, public cart: CartService, private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document) { }

  //TODO - add an animation for expand image.

  ngAfterViewInit(): void {
    this.storage.recommended.subscribe((value: Product[]) => { this.recommendations = value });
    this.storage.recently.subscribe((value: Product[]) => { this.recently = value });
  }

  ngOnInit(): void {
    this.desktop = window.innerWidth > 840 ? true : false;

    this.route.params.subscribe(
      params => {
        const name = params['productName'];
        this.getProduct(name);
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
      switch (this.product.size) {
        case Size.small:
          this.width = 800;
          this.height = 700;
          this.expandWidth = 1000;
          this.expandHeight = 900;
          break;

        case Size.medium:
          this.width = 800;
          this.height = 800;
          this.expandWidth = 950;
          this.expandHeight = 950;
          break;

        case Size.large:
          this.width = 600;
          this.height = 800;
          this.expandWidth = 650;
          this.expandHeight = 950;
          break;
      }
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
