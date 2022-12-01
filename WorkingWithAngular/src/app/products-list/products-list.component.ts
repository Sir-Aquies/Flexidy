import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { __values } from 'tslib';
import { CartService } from '../cart.service';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit, AfterContentInit, OnDestroy {
  //TODO -  add more products when scrolling down.
  products = this.storage.products;
  columns: Product[][] = []
  controller = new AbortController();
  load = 0;

  constructor(public cart: CartService, private storage: ProductsService) { }

  ngOnDestroy(): void {
    this.controller.abort();
  }

  ngAfterContentInit(): void {
    this.productsCheck();
  }

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.FlexColumn();
    }, { signal: this.controller.signal });

    window.addEventListener('scroll', () => {
      this.PopulateList();
    })
  }

  productsCheck() {
    if (this.products.length !== 0) {
      clearInterval(this.load);
      this.FlexColumn();
    }
    else {
      this.load = window.setInterval(() => { this.productsCheck() }, 5000);
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

  PopulateList() {
    const container = document.getElementById("products_flex") as HTMLDivElement;
    const list = this;

    if (window.scrollY > (container.offsetHeight - container.offsetTop)) {

      const myObserver = {
        next: (products: any) => {
          this.products = this.products.concat(products);
          this.FlexColumn();
        }
      };

      this.storage.scroolProduct.subscribe(myObserver);

      for (let i = 0; i < list.columns.length; i++) {
        

        
      }
    }
  }

  refreshList() {
    //let amount = document.getElementById('product_amount') as HTMLSelectElement;
    //if (amount) {
    //  this.storage.fillArray(parseInt(amount.value));
    //  this.products = this.storage.products;
    //}
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
