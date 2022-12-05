import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ProductsService, Size } from '../products.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  products = this.storage.ProductArray(6);
  id = 0;
  backgrounds: number[] = [715, 360, 1006, 135, 788, 1031, 466, 62, 992, 1022, 940, 952, 65, 683, 120, 724, 869];
  //backgrounds: number[] = [940];


  //TODO - mini gallery fix images responsive size;

  constructor(private storage: ProductsService, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const divImg = this.document.getElementById('background-band') as HTMLDivElement;
    this.id = this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    divImg.style.backgroundImage = `url(https://picsum.photos/id/${this.id}/1810/600)`;
  }

}
