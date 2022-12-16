import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  resizeListener: any;
  scroolListener: any;
  load = 0;
  loadingBar: HTMLDivElement | undefined;
  loadingProducts = false;

  constructor(public cart: CartService, private storage: ProductsService, private renderer: Renderer2) {
  }
  //TODO - fix the scroll position restauration problem.
  //TODO - Add a price filter
  ngOnDestroy(): void {
    if (this.resizeListener) this.resizeListener();
    if (this, this.scroolListener) this.scroolListener();
    clearInterval(this.load);
  }

  ngAfterContentInit(): void {
    this.loadingBar = document.getElementById('loading_bar') as HTMLDivElement;

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
    }

    this.productsCheck();
  }

  ngOnInit(): void {
    this.products = this.storage.products;
  }

  productsCheck() {
    let percent = (this.products.length / this.storage.productLength) * 100;
    if (this.loadingBar) this.loadingBar.style.width = `${percent}%`;

    if (this.products.length === this.storage.productLength) {
      clearInterval(this.load);

      this.resizeListener = this.renderer.listen('window', 'resize', () => {
        this.FlexColumn()
      });

      this.scroolListener = this.renderer.listen('window', 'scroll', () => {
        this.expandProducts();
      });

      const loadingGif = document.getElementById('loading_gif') as HTMLElement;
      if (loadingGif) loadingGif.style.display = 'none';
      if (this.loadingBar) if (this.loadingBar.parentElement) this.loadingBar.parentElement.style.display = `none`;

      (document.getElementById('product_selector') as HTMLSelectElement).disabled = false;

      this.load = 0;
      this.filter();
    }
    else {
      if (this.load == 0) {
        this.load = window.setInterval(() => { this.productsCheck() }, 100);
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

  expandProducts() {
    const container = document.getElementById("products_flex") as HTMLDivElement;
    let expandAmount = 5 * this.columns.length;
    if (this.loadingProducts) return;

    if (window.scrollY > (container.offsetHeight * (65 / 100))) {
      this.loadingProducts = true;

      const productArr = this.storage.ProductArray(expandAmount);

      let timer = window.setInterval(() => {
        if (productArr.length === expandAmount) {
          let index = 0;
          for (let i = 0; i < productArr.length; i++) {
            this.columns[index++].push(productArr[i]);

            if (index === this.columns.length) index = 0;
          }

          this.storage.products = this.storage.products.concat(productArr)
          this.products = this.storage.products;

          window.clearInterval(timer);
          this.loadingProducts = false;
          }
        }, 100);
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
