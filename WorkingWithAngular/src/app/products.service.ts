import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface Product {
  name: string,
  author?: string,
  uid: string,
  price: number,
  image?: string,
  stringPrice?: string
  size?: Size
}

export enum Size {
  default,
  medium,
  large,
  small
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  products: Product[] = [];
  single = new BehaviorSubject<Product>(this.SingleProduct());
  recommended = new BehaviorSubject<Product[]>(this.ProductArray(15));
  recently = new BehaviorSubject<Product[]>(this.ProductArray(10));

  constructor(private http: HttpClient) {
    this.fillArray(20);
  }

  RandomSize():Size {
    const sizes: Size[] = [Size.small, Size.medium, Size.large];

    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  SingleProduct(size: Size = Size.default): any {
    this.getJSON("https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum").subscribe(data => {
      const product: Product = {
        name: (data as any).short_sentence,
        uid: (data as any).uid,
        price: Math.round(((Math.random() * 100) + Number.EPSILON) * 100) / 100
      };

      if (size === Size.default) {
        product.size = this.RandomSize();
      }
      else {
        product.size = size;
      }

      product.stringPrice = product.price.toFixed(2);

      this.getPicsum(Math.floor(Math.random() * 1085), product.size ? product.size : Size.default).subscribe(data => {
        if (data.status === 200) {
          product.image = data.url;
        }
      });

      this.getJSON("https://random-data-api.com/api/users/random_user").subscribe(data => {
        product.author = `${(data as any).first_name} ${(data as any).last_name}`;
      });

      this.single.next(product);
    });
  }

  ProductArray(amount: number, size: Size = Size.default): Product[] {
    const output: Product[] = [];

    while (amount > 0) {
      this.getJSON("https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum").subscribe(data => {
        const product: Product = {
          name: (data as any).short_sentence,
          uid: (data as any).uid,
          price: Math.round(((Math.random() * 100) + Number.EPSILON) * 100) / 100
        };

        if (size === Size.default) {
          product.size = this.RandomSize();
        }
        else {
          product.size = size;
        }

        product.stringPrice = product.price.toFixed(2);

        this.getPicsum(Math.floor(Math.random() * 1085), product.size ? product.size : Size.default).subscribe(data => {
          if (data.status === 200) {
            product.image = data.url;
            output.push(product);
          }
        });

        this.getJSON("https://random-data-api.com/api/users/random_user").subscribe(data => {
          product.author = `${(data as any).first_name} ${(data as any).last_name}`;
        });
      });

      amount--;
    }

    return output;
  }

  fillArray(amount: number, size: Size = Size.default) {
    this.products.splice(0, this.products.length);
    while (amount > 0) {
      this.getJSON("https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum").subscribe(data => {
        const product: Product = {
          name: (data as any).short_sentence,
          uid: (data as any).uid,
          price: Math.round(((Math.random() * 100) + Number.EPSILON) * 100) / 100
        };

        if (size === Size.default) {
          product.size = this.RandomSize();
        }
        else {
          product.size = size;
        }

        product.stringPrice = product.price.toFixed(2);

        this.getPicsum(Math.floor(Math.random() * 1085), product.size ? product.size : Size.default).subscribe(data => {
          if (data.status === 200) {
            product.image = data.url;
            this.products.push(product);
          }
        });

        this.getJSON("https://random-data-api.com/api/users/random_user").subscribe(data => {
          product.author = `${(data as any).first_name} ${(data as any).last_name}`;
        });
      });

      amount--;
    }
  }

  private getJSON(url: string): Observable<any> {
    return this.http.get<any>(url, {observe:'body', responseType:'json'});
  }

  private getPicsum(id: number, size: Size): Observable<any> {
    let sizes: number[][] = [[500, 400], [500, 500], [500, 750]];

    let width = 0;
    let height = 0;

    switch (size) {
      case Size.small:
        width = sizes[0][0];
        height = sizes[0][1];
        break;

      case Size.medium:
        width = sizes[1][0];
        height = sizes[1][1];
        break;

      case Size.large:
        width = sizes[2][0];
        height = sizes[2][1];
        break;

      case Size.default:
        let size = sizes[Math.floor(Math.random() * sizes.length)];
        width = size[0];
        height = size[1];
        break;
    }

    return this.http.get(`https://picsum.photos/id/${ id }/${ width }/${ height }`, { observe: 'response', responseType: 'text' });
  }
}
