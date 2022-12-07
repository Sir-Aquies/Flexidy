import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Product, ProductsService, Size } from '../products.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  products: Product[] = this.storage.ProductArray(6);
  id = 0;
  backgrounds: number[] = [715, 360, 1006, 135, 788, 1031, 466, 62, 992, 1022, 940, 952, 683, 120, 724, 869];
  //backgrounds: number[] = [940];

  constructor(private storage: ProductsService, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const divImg = this.document.getElementById('background-band') as HTMLDivElement;
    this.id = this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    const data = this.storage.getJSON(`https://picsum.photos/id/${this.id}/info`);

    data.subscribe(data => {
      divImg.style.backgroundImage = `url(${data.download_url})`;
    });

    //let index = 0;
    //while (this.products.length != 6) {

    //  if (this.storage.products[index].size == Size.small) {
    //    this.products.push(this.storage.products[index]);
    //  }

    //  index++;
    //}
  }

}
