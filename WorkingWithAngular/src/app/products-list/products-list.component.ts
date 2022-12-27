import { AfterContentInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { __values } from 'tslib';
import { CartService } from '../cart.service';
import { ProductsService, Product, Size } from '../products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit, AfterContentInit, OnDestroy {
  columns: Product[][] = []
  resizeListener: any;
  scroolListener: any;
  loadProductsTimer = 0;
  loadingBar: HTMLDivElement | undefined;
  loadingProducts = false;
  scrollRestaurationTimer = 0;

  constructor(public cart: CartService, private storage: ProductsService, private renderer: Renderer2) {
  }
  //TODO - Add a price filter (for free).
  ngOnDestroy(): void {
    if (this.resizeListener) this.resizeListener();
    if (this.scroolListener) this.scroolListener();

    clearInterval(this.loadProductsTimer);
    clearInterval(this.scrollRestaurationTimer);
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
    this.columns = this.storage.columns;
  }

  productsCheck() {
    let percent = (this.storage.products.length / this.storage.productLength) * 100;
    if (this.loadingBar) this.loadingBar.style.width = `${percent}%`;

    if (this.storage.products.length >= this.storage.productLength) {
      clearInterval(this.loadProductsTimer);

      this.resizeListener = this.renderer.listen('window', 'resize', () => {
        this.SetUpProducts();
      });

      this.scroolListener = this.renderer.listen('window', 'scroll', () => {
        this.expandProducts();
      });

      const loadingGif = document.getElementById('loading_gif') as HTMLElement;
      if (loadingGif) loadingGif.style.display = 'none';

      if (this.loadingBar) if (this.loadingBar.parentElement) this.loadingBar.parentElement.style.display = `none`;

      (document.getElementById('product_selector') as HTMLSelectElement).disabled = false;

      this.loadProductsTimer = 0;
      this.SetUpProducts();

      this.restoreScrollPosition();
    }
    else {
      if (this.loadProductsTimer == 0) {
        this.loadProductsTimer = window.setInterval(() => { this.productsCheck() }, 100);
      }
    }
  }

  SetUpProducts() {
    let size = parseInt((document.getElementById('product_selector') as HTMLInputElement).value);

    if (Number(sessionStorage.getItem('filter')) !== size) {
      this.FilterProducts();
    }
    else {
      if (this.storage.columns.length === 0) {
        this.SetUpColumns(this.storage.products);
      }
    }
  }

  FilterProducts() {
    let size = parseInt((document.getElementById('product_selector') as HTMLInputElement).value);

    if (size !== Size.default) {
      const filteredProducts: Product[] = [];

      for (let i = 0; i < this.storage.products.length; i++) {
        if (this.storage.products[i].size === size) {
          filteredProducts.push(this.storage.products[i]);
        }
      }

      this.SetUpColumns(filteredProducts);
    }
    else {
      this.SetUpColumns(this.storage.products);
    }

    if (typeof (Storage) !== "undefined") {
      sessionStorage.setItem('filter', size.toString());
    }
  }

  SetUpColumns(productsSource: Product[]) {
    const container = document.getElementById("products_flex") as HTMLDivElement;
    let columnsAmount = Math.round(container.offsetWidth / 500);
    let productPerColumn = Math.floor(productsSource.length / columnsAmount);
    let index = 0;

    this.storage.columns.forEach(value => {
      value.splice(0, value.length);
    });
    this.storage.columns.splice(0, this.storage.columns.length);

    for (let i = 0; i < columnsAmount; i++) {
      const products: Product[] = [];

      for (let j = 0; j < productPerColumn; j++) {
        if (productsSource[index] != undefined) {
          products.push(productsSource[index++]);
        }
      }

      this.storage.columns.push(products);
    }

    this.columns = this.storage.columns;
  }

  expandProducts() {
    if (this.loadingProducts) return;
    let size = document.getElementById('product_selector') as HTMLSelectElement;
    const container = document.getElementById("products_flex") as HTMLDivElement;
    let expandAmount = 5 * this.storage.columns.length;

    if (window.scrollY > (container.offsetHeight * (65 / 100))) {
      this.loadingProducts = true;

      const productArr = this.storage.productArraySetSize(expandAmount, parseInt(size.value));

      let timer = window.setInterval(() => {
        if (productArr.length === expandAmount) {
          let index = 0;

          for (let i = 0; i < productArr.length; i++) {
            this.storage.columns[index++].push(productArr[i]);

            if (index === this.storage.columns.length) index = 0;
          }

          this.storage.products = this.storage.products.concat(productArr)

          window.clearInterval(timer);
          this.loadingProducts = false;
          }
        }, 100);
    }
  }

  saveScrollPosition() {
    if (typeof (Storage) !== "undefined") {
      sessionStorage.setItem('scrollPosition', `${window.scrollY}`);
    }
  }

  restoreScrollPosition() {
    if (typeof (Storage) !== "undefined") {
      let scrollY = Number(sessionStorage.getItem('scrollPosition'));

      if (scrollY) {
        this.scrollRestaurationTimer = window.setInterval(() => {
          if (window.scrollY !== scrollY) {
            scroll(0, scrollY);
          }
          else {
            window.clearInterval(this.scrollRestaurationTimer);
          }
        }, 50)
        sessionStorage.setItem('scrollPosition', "0");
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
