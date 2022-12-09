import { Component, Inject, Input, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('loading_gif') gif: ElementRef | undefined;
  loadingGif: HTMLDivElement | undefined;

  @ViewChild('loading_bar') bar: ElementRef | undefined;
  loadingBar: HTMLDivElement | undefined;

  constructor(@Inject(DOCUMENT) private document: Document, public cart: CartService) {
  }

  ngOnDestroy(): void {
    //TODO - fix this.
    //this.controller.abort();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.productsCheck();

    if (this.gif) this.loadingGif = this.gif.nativeElement;

    //if (this.bar) this.loadingBar = this.bar.nativeElement;

    window.addEventListener('resize', () => {
      this.loadCarousel()
    }, { signal: this.controller.signal });
  }

  productsCheck() {
    //let percent = (this.products.length / 25) * 100;
    //if (this.loadingBar) this.loadingBar.style.width = `${percent}%`;

    if (this.products.length == 25) {
      window.clearInterval(this.load);

      if (this.loadingGif) this.loadingGif.style.display = 'none';
      //if (this.loadingBar) if (this.loadingBar.parentElement) this.loadingBar.parentElement.style.display = `none`;

      this.load = 0;
      this.loadCarousel();
    }
    else {
      if (this.load == 0) {
        this.load = window.setInterval(() => { this.productsCheck() }, 100);
      }
    }
  }

  loadCarousel() {
    const carousel = this.document.getElementById('carousel') as HTMLDivElement;
    const width = 300;
    let inicialAmount = Math.round(carousel.offsetWidth / width);

    if (inicialAmount > 2) inicialAmount--;

    let index = 0;
    this.pages = Math.round(this.products.length / inicialAmount);
    this.currentPage = 0;

    this.productPages.forEach(value => {
      value.splice(0, value.length);
    });
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
