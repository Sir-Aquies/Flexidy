import { Component, Inject, Input, OnInit, AfterViewInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../products.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterViewInit {
  @Input() products: Product[] = [];
  current: Product[] = [];
  inicial = 0;
  final = 0;
  step = 0;

  constructor(@Inject(DOCUMENT) private document: Document, public cart: CartService) { }

  ngAfterViewInit(): void {
    const carousel = this.document.getElementById('carousel') as HTMLDivElement;

    window.addEventListener('resize', () => {
      const width = 290;
      let inicialAmount = Math.round(carousel.offsetWidth / width);

      if (inicialAmount > 2) {
        inicialAmount--;
      }

      this.current.splice(0, this.current.length);
      for (let i = 0; i < inicialAmount; i++) {
        this.current.push(this.products[i]);
      }

      this.inicial = 0;
      this.final = this.current.length;
      this.step = this.current.length;
    });

    this.inicial = 0;
    this.final = this.current.length;
    this.step = this.current.length;
  }

  ngOnInit(): void {
    const carousel = this.document.getElementById('carousel') as HTMLDivElement;
    const width = 290;
    let inicialAmount = Math.round(carousel.offsetWidth / width);

    if (inicialAmount > 2) {
      inicialAmount--;
    }

    this.current.splice(0, this.current.length);
    for (let i = 0; i < inicialAmount; i++) {
      this.current.push(this.products[i]);
    }
    this.step = this.current.length;
  }

  leftSwipe() {
    if (this.inicial <= 0) {
      return;
    }

    this.final = this.inicial;
    this.inicial -= this.step;

    this.current.splice(0, this.current.length);

    for (let i = this.inicial; i < this.final; i++) {
      if (this.products[i] !== undefined) {
        this.current.push(this.products[i]);
      }
    }
  }

  rightSwipe() {
    if (this.final >= this.products.length) {
      return;
    }

    this.inicial = this.final;
    this.final += this.step;

    this.current.splice(0, this.current.length);
    for (let i = this.inicial; i < this.final; i++) {
      if (this.products[i] !== undefined) {
        this.current.push(this.products[i]);
      }
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
