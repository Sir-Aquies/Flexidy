import { Component } from '@angular/core';
import { ProductsArray } from './Products';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
  products = ProductsArray(20);
  title = 'WorkingWithAngular';
}
