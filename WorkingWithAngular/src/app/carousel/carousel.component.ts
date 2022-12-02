import { Component, Inject, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../products.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() products: Product[] = [];
  productPages: Product[][] = [];
  current: Product[] = [];
  pages = 0;
  currentPage = 0;
  load = 0;
  controller = new AbortController();

  constructor(@Inject(DOCUMENT) private document: Document, public cart: CartService) { }

  loadCarousel() {
    const carousel = this.document.getElementById('carousel') as HTMLDivElement;
    const width = 300;
    let inicialAmount = Math.round(carousel.offsetWidth / width);

    if (inicialAmount > 2) {
      inicialAmount--;
    }

    let index = 0;
    this.pages = Math.round(this.products.length / inicialAmount);
    this.currentPage = 0;

    this.productPages.forEach(value => {
      value.splice(0, value.length);
    })
    this.productPages.splice(0, this.productPages.length);

    for (let i = 0; i < this.pages; i++) {
      const page: Product[] = [];
      for (let j = 0; j < inicialAmount; j++) {
        if (this.products[index] != undefined) {
          page.push(this.products[index++]);
        }
      }
      this.productPages.push(page);
    }

    this.current = this.productPages[0];
  }

  productsCheck() {
    if (this.products.length !== 0) {
      window.clearInterval(this.load);
      this.load = 0;
      this.loadCarousel();
    }
    else {
      if (this.load == 0) {
        this.load = window.setInterval(() => { this.productsCheck() }, 3000);
      }
    }
  }

  ngAfterViewInit(): void {
    this.productsCheck();
    window.addEventListener('resize', () => {
      this.loadCarousel()
    }, {signal: this.controller.signal});
  }

  ngOnDestroy(): void {
    this.controller.abort();
  }

  ngOnInit(): void {
    
  }

  leftSwipe() {
    if (this.currentPage <= 0) {
      this.currentPage = this.pages;
      this.current = this.productPages[--this.currentPage];
    }
    else {
      this.current = this.productPages[--this.currentPage];
    }
  }

  rightSwipe() {
    if (this.currentPage >= (this.pages - 1)) {
      this.currentPage = 0;
      this.current = this.productPages[this.currentPage];
    }
    else {
      this.current = this.productPages[++this.currentPage];
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
