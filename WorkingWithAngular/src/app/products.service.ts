import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, Observer, of } from 'rxjs';

export interface Product {
  name?: string,
  author?: string,
  uid?: string,
  price?: number,
  image?: string,
  stringPrice?: string
  size?: Size
  width?: number,
  height?: number
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
  products: Product[] = this.ProductArray(100);
  recommended = new BehaviorSubject<Product[]>(this.ProductArray(15));
  recently = new BehaviorSubject<Product[]>(this.ProductArray(10));

  scroolProduct = of(this.ProductArray(10));

  constructor(private http: HttpClient) {
  }

  async SynchronousProductArray(amount: number): Promise<Product[]> {
    const output: Product[] = [];

    while (amount > 0) {
      let info = await this.getJSONSync("https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum");

      const product: Product = {
        name: (info as any).short_sentence,
        uid: (info as any).uid,
      };

      product.price = Math.round(((Math.random() * 100) + Number.EPSILON) * 100) / 100;
      product.stringPrice = product.price.toFixed(2);

      let pic = await this.getJSONSync('https://picsum.photos/id/${Math.floor(Math.random() * 1085)}/info');

      product.image = pic.download_url;
      product.author = pic.author;
      product.width = pic.width;
      product.height = pic.height;

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
      }

      output.push(product);
      amount--;
    }

    return output;
  }

  private getJSONSync(url: string): Promise<any> {
    return this.http.get<any>(url, { observe: 'body', responseType: 'json' }).toPromise();
  }

  ProductArray(amount: number): Product[] {
    const output: Product[] = [];

    while (amount > 0) {
      const product: Product = {};

      this.getJSON("https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum").subscribe(data => {
        product.name = (data as any).short_sentence;
        product.uid = (data as any).uid;
      });

      product.price = Math.round(((Math.random() * 100) + Number.EPSILON) * 100) / 100;
      product.stringPrice = product.price.toFixed(2);

      this.getJSON(`https://picsum.photos/id/${Math.floor(Math.random() * 1085)}/info`).subscribe(data => {
        product.image = data.download_url;
        product.author = data.author;
        product.width = data.width;
        product.height = data.height;

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
        }

        output.push(product);
      });

      amount--;
    }

    return output;
  }

  private getJSON(url: string): Observable<any> {
    return this.http.get<any>(url, {observe:'body', responseType:'json'});
  }
}
