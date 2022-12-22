import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Product, ProductsService, Size } from '../products.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  id = 0;
  backgrounds: number[] = [715, 360, 1006, 788, 1031, 466, 62, 992, 1022, 940, 952, 683, 120, 724, 869];
  //backgrounds: number[] = [940];
  //TODO - fix the responsiness of home

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

    const ad = document.getElementById('ad') as HTMLDivElement;
    ad.style.backgroundPositionY = '-40px';
    let direction = -1;
    window.setInterval(() => {
      let yPos = parseInt(ad.style.backgroundPositionY);
      yPos += direction;

      ad.style.backgroundPositionY = `${yPos}px`;

      if (yPos <= -744) {
        direction = -direction;
      }

      if (yPos > -40) {
        direction = -direction;
      }
    }, 80);
  }

}
