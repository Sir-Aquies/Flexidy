import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { data } from 'jquery';
import { Observable } from 'rxjs';
import { __values } from 'tslib';
import { CartService } from '../cart.service';
import { ProductsService, Product, Size } from '../products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit, AfterContentInit, OnDestroy {
  products: Product[] = [];
  columns: Product[][] = []
  resizeController = new AbortController();
  load = 0;
  constructor(public cart: CartService, private storage: ProductsService) {
    this.products = this.storage.products;
  }

  //TODO - Put one product per picsum in a database using ADO.net.
  //TODO - Add products as the user scrolls down.

  ngOnDestroy(): void {
    this.resizeController.abort();
  }

  ngAfterContentInit(): void {
    this.productsCheck();
  }

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.FlexColumn();
    }, { signal: this.resizeController.signal });

    if (sessionStorage.getItem('filter')) {
      let size = document.getElementById('product_selector') as HTMLSelectElement;

      switch (sessionStorage.getItem('filter')) {
        case '1':
          size.value = '1';
          break;
        case '2':
          size.value = '2';
          break;
        case '3':
          size.value = '3';
          break;
        default:
          size.value = '0';
          break;
      }

      this.filter();
    }
  }

  productsCheck() {
    if (this.products.length > 70) {
      clearInterval(this.load);

      const loadingGif = document.getElementById('loading_gif') as HTMLElement;
      if (loadingGif) loadingGif.style.display = 'none';

      this.load = 0;
      this.FlexColumn();
    }
    else {
      if (this.load == 0) {
        this.load = window.setInterval(() => { this.productsCheck() }, 1000);
      }
    }
  }

  FlexColumn() {
    const container = document.getElementById("products_flex") as HTMLDivElement;
    let columnsAmount = Math.round(container.offsetWidth / 500);
    let productPerColumn = Math.floor(this.products.length / columnsAmount);
    let index = 0;

    this.columns.forEach(value => {
      value.splice(0, value.length);
    });
    this.columns.splice(0, this.columns.length);

    for (let i = 0; i < columnsAmount; i++) {
      const products: Product[] = [];

      for (let j = 0; j < productPerColumn; j++) {
        if (this.products[index] != undefined) {
          products.push(this.products[index++]);
        }
      }

      this.columns.push(products);
    }
  }

  filter() {
    let size = document.getElementById('product_selector') as HTMLSelectElement;

    if (parseInt(size.value) !== Size.default) {
      const filteredProducts: Product[] = [];

      for (let i = 0; i < this.storage.products.length; i++) {
        if (this.storage.products[i].size === parseInt(size.value)) {
          filteredProducts.push(this.storage.products[i]);
        }
      }

      this.products = filteredProducts;
      this.FlexColumn();
    }
    else {
      this.products = this.storage.products;
      this.FlexColumn();
    }

    if (typeof (Storage) !== "undefined") {
      sessionStorage.setItem('filter', size.value);
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
