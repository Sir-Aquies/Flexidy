import { Component, OnInit } from '@angular/core';
import { ProductsArray } from '../Products';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products = ProductsArray(6);

  constructor() { }

  ngOnInit(): void {
  }

}
