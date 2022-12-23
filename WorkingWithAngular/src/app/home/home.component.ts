import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Product, ProductsService, Size } from '../products.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  id = 0;
  backgroundListener: any;
  backgrounds: number[] = [715, 360, 1006, 788, 1031, 466, 62, 992, 1022, 940, 952, 683, 120, 724, 869];
  //backgrounds: number[] = [940];

  constructor(private storage: ProductsService, @Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {
  }

  ngOnDestroy(): void {
    if (this.backgroundListener) this.backgroundListener();
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

    const ad = this.document.getElementById('ad') as HTMLDivElement;

    window.setTimeout(() => {
      ad.style.backgroundPositionY = '-2900px';

      this.backgroundListener = this.renderer.listen(ad, 'transitionend', () => {
        let yPos = parseInt(ad.style.backgroundPositionY);

        if (yPos >= -10) {
          ad.style.backgroundPositionY = '-2900px';
        }

        if (yPos <= -2900) {
          ad.style.backgroundPositionY = '-10px';
        }
      });
    }, 1000)

    
  }

}
