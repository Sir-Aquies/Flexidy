import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './Products';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: Product[] = [];
  cartlength = new BehaviorSubject<number>(this.items.length);
  totalCost = 0;

  setTotalCost() {
    let cost = 0;

    this.items.forEach(value => {
      cost += value.price;
    })

    this.totalCost = Math.round((cost + Number.EPSILON) * 100) / 100;
  }

  constructor() { }

  addItem(product: Product) {
    this.items.push(product);
    this.cartlength.next(this.items.length);

    this.setTotalCost();
  }

  removeItem(product: Product) {
    let index = this.items.indexOf(product);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    this.cartlength.next(this.items.length);

    this.setTotalCost();
  }

  getItems() {
    this.setTotalCost();
    return this.items;
  }

  clearCart() {
    this.items = [];
    this.setTotalCost();
    return this.items;
  }
}
