import { Component, OnInit } from '@angular/core';
import { ProductsArray } from '../Products';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  products = ProductsArray(20);

  constructor() { }

  ngOnInit(): void {}

}
