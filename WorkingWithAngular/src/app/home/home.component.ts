import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../products.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  products = this.productServ.ProductArray(6);

  backgrounds: number[] = [715, 360, 1006, 135, 1058, 788, 1031, 466, 62, 992];
  id = 0;
  constructor(private productServ: ProductsService, @Inject(DOCUMENT) document: Document) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const divImg = document.getElementById('background-band') as HTMLDivElement;
    this.id = Math.floor(Math.random() * 1085);
    divImg.style.backgroundImage = `url(https://picsum.photos/id/${this.id}/1810/500)`;
  }

}
