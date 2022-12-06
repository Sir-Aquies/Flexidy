import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { ProductsService, Product, Size } from '../products.service';


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit, AfterViewInit, OnDestroy {
  product: Product | undefined;
  recommendations: Product[] = [];
  recently: Product[] = [];
  related: Product[] = this.storage.ProductArray(2);
  desktop = false;

  constructor(private storage: ProductsService, public cart: CartService, private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document) { }

  ngOnDestroy(): void {
    this.document.body.style.overflow = 'auto';
  }

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
  }

  expandImg() {
    const bg = this.document.getElementById('full_size') as HTMLDivElement;
    const image = this.document.getElementById('expand_image') as HTMLDivElement;
    bg.style.display = 'flex';
    this.document.body.style.overflow = 'hidden';

    window.setTimeout(() => {
      image.style.transform = 'scale(1, 1)';
    }, 100)

    bg.onclick = () => {
      image.style.transform = 'scale(0, 0)';
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
