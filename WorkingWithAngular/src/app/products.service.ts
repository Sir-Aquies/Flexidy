import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';

export interface Product {
  name: string,
  author: string,
  id: number,
  uid: string,
  image: string,
  price?: number,
  stringPrice?: string
  size?: Size
  width: number,
  height: number
  reducedImage?: string;
}

export enum Size {
  default,
  small,
  medium,
  large
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  productLength = 100;
  products: Product[] = this.ProductArray(this.productLength);
  recommended = new BehaviorSubject<Product[]>(this.ProductArray(25));
  recently = new BehaviorSubject<Product[]>(this.ProductArray(25));
  related = new BehaviorSubject<Product[]>(this.ProductArray(2));
  sizes: number[][] = [[700, 500], [700, 700], [700, 950]];

  constructor(private http: HttpClient) {
  }

  productArraySetSize(amount: number, size: Size = Size.default) {
    const output: Product[] = [];

    const getProduct = this.getJSON("https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum").pipe(
      switchMap(info => {
        return this.getJSON(`https://picsum.photos/v2/list?page=${Math.floor(Math.random() * 994)}&limit=1`).pipe(map(data => {
          const [image] = data;

          const product: Product = {
            name: (info as any).short_sentence,
            uid: (info as any).uid,
            id: image.id,
            image: image.download_url,
            author: image.author,
            width: image.width,
            height: image.height,
          };

          let reducedWidth = 0;
          let reducedHeight = 0;

          if (product.width && product.height) {
            if (product.size !== Size.default) {
              switch (size) {
                case Size.small:
                  reducedWidth = this.sizes[0][0];
                  reducedHeight = this.sizes[0][1];
                  product.width = this.sizes[0][0];
                  product.height = this.sizes[0][1];
                  break;

                case Size.medium:
                  reducedWidth = this.sizes[1][0];
                  reducedHeight = this.sizes[1][1];
                  product.width = this.sizes[1][0];
                  product.height = this.sizes[1][1];
                  break;

                case Size.large:
                  reducedWidth = this.sizes[2][0];
                  reducedHeight = this.sizes[2][1];
                  product.width = this.sizes[2][0];
                  product.height = this.sizes[2][1];
                  break;
              }
              product.size = size;
              product.image = `https://picsum.photos/id/${product.id}/${product.width}/${product.height}`;
            }
            else {
              if (product.width > (product.height + 1000)) {
                product.size = Size.small;
              }
              else if (product.height > product.width) {
                product.size = Size.large;
              }
              else if (product.width > product.height) {
                product.size = Size.medium;
              }

              switch (product.size) {
                case Size.small:
                  reducedWidth = this.sizes[0][0];
                  reducedHeight = this.sizes[0][1];
                  break;

                case Size.medium:
                  reducedWidth = this.sizes[1][0];
                  reducedHeight = this.sizes[1][1];
                  break;

                case Size.large:
                  reducedWidth = this.sizes[2][0];
                  reducedHeight = this.sizes[2][1];
                  break;
              }
            }
          }

          product.reducedImage = `https://picsum.photos/id/${product.id}/${reducedWidth}/${reducedHeight}`;

          if (Math.floor(Math.random() * 3) == 2) {
            product.price = 0;
            product.stringPrice = 'Free';
          }
          else {
            product.price = Math.round(((Math.random() * 100) + Number.EPSILON) * 100) / 100;
            product.stringPrice = product.price.toFixed(2);
          }

          return product;
        }));
      }));

    while (amount > 0) {
      getProduct.subscribe(product => {
        output.push(product);
      })
      amount--;
    }

    return output;
  }

  ProductArray(amount: number): Product[] {
    const output: Product[] = [];

    const getProduct = this.getJSON("https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum").pipe(
      switchMap(info => {
        return this.getJSON(`https://picsum.photos/v2/list?page=${Math.floor(Math.random() * 994)}&limit=1`).pipe(map(data => {
          const [image] = data;

          const product: Product = {
            name: (info as any).short_sentence,
            uid: (info as any).uid,
            id: image.id,
            image: image.download_url,
            author: image.author,
            width: image.width,
            height: image.height,
          };

          let reducedWidth = 0;
          let reducedHeight = 0;

          if (product.width && product.height) {
            if (product.width > (product.height + 1000)) {
              product.size = Size.small;
            }
            else if (product.height > product.width) {
              product.size = Size.large;
            }
            else if (product.width > product.height) {
              product.size = Size.medium;
            }

            switch (product.size) {
              case Size.small:
                reducedWidth = this.sizes[0][0];
                reducedHeight = this.sizes[0][1];
                break;

              case Size.medium:
                reducedWidth = this.sizes[1][0];
                reducedHeight = this.sizes[1][1];
                break;

              case Size.large:
                reducedWidth = this.sizes[2][0];
                reducedHeight = this.sizes[2][1];
                break;
            }
          }

          product.reducedImage = `https://picsum.photos/id/${product.id}/${reducedWidth}/${reducedHeight}`;

          if (Math.floor(Math.random() * 3) == 2) {
            product.price = 0;
            product.stringPrice = 'Free';
          }
          else {
            product.price = Math.round(((Math.random() * 100) + Number.EPSILON) * 100) / 100;
            product.stringPrice = product.price.toFixed(2);
          }

          return product;
        }));
    }));

    while (amount > 0) {
      getProduct.subscribe(product => {
        output.push(product);
      })
      amount--;
    }

    return output;
  }

  getJSON(url: string): Observable<any> {
    return this.http.get<any>(url, {observe:'body', responseType:'json'});
  }
}

//const product: Product = {};
//this.getJSON("https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum").subscribe(data => {
//  product.name = (data as any).short_sentence;
//  product.uid = (data as any).uid;
//});

//product.price = Math.round(((Math.random() * 100) + Number.EPSILON) * 100) / 100;
//product.stringPrice = product.price.toFixed(2);

//this.getJSON(`https://picsum.photos/id/${Math.floor(Math.random() * 1085)}/info`).subscribe(data => {
//  product.image = data.download_url;
//  product.author = data.author;
//  product.width = data.width;
//  product.height = data.height;

//  if (product.width && product.height) {
//    if (product.width > (product.height + 1000)) {
//      product.size = Size.small;
//    }
//    else if (product.height > product.width) {
//      product.size = Size.large;
//    }
//    else if (product.width > product.height) {
//      product.size = Size.medium;
//    }
//  }

//  output.push(product);
//});
