import { DOCUMENT } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, AfterViewInit, OnDestroy {

  items = this.cart.getItems();
  recommendations: Product[] = [];
  recently: Product[] = [];
  relatedArray: Product[] = [];
  related: Product[] = [];
  slideIndex = 0;
  clearSlide = 0;
  desktop = false;

  constructor(public cart: CartService, private storage: ProductsService, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnDestroy(): void {
    window.clearInterval(this.clearSlide);
  }

  ngAfterViewInit(): void {
    const unsubRecom = this.storage.recommended.subscribe((value: Product[]) => {
      this.recommendations = value;
    });

    unsubRecom.unsubscribe();

    const unsubRecently = this.storage.recently.subscribe((value: Product[]) => {
      this.recently = value;
    });

    unsubRecently.unsubscribe();

    const unsubRela = this.storage.related.subscribe(value => {
      this.relatedArray = value;
    })

    unsubRela.unsubscribe();

    this.slideRelated();
    //this.clearSlide = window.setInterval(() => {
    //  this.slideRelated();
    //}, 1000)
    
    //window.addEventListener('resize', () => {
    //  this.desktopCheck();
    //});
  }

  ngOnInit(): void {
    this.desktop = window.innerWidth > 840 ? true : false;
  }

  slideRelated() {
    let count = 0;
    if (this.relatedArray.length == 0) return;

    this.related.splice(0, this.related.length);

    while (count !== 2) {
      if (this.slideIndex == this.relatedArray.length) {
        this.slideIndex = 0;
      }
      this.related.push(this.relatedArray[this.slideIndex++]);
      count++;
    }

    const section = this.document.getElementById('relatedSection');
    if (section) {
      section.style.height = `${section.clientHeight}px`;
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
