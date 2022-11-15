import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './Products';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: Product[] = [];
  cartlength = new BehaviorSubject<number>(this.items.length);

  constructor() { }

  addItem(product: Product) {
    this.items.push(product);
    this.cartlength.next(this.items.length);
  }

  removeItem(product: Product) {
    let index = this.items.indexOf(product);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    this.cartlength.next(this.items.length);
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }
}
