import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../products.service';

@Component({
  selector: 'app-singular-product',
  templateUrl: './singular-product.component.html',
  styleUrls: ['./singular-product.component.css']
})
export class SingularProductComponent implements OnInit {

  constructor() { }

  @Input() product!: Product;
  @Input() onCart = false;
  @Output() addToCart = new EventEmitter();
  @Output() removeFromCart = new EventEmitter();
  @Output() anchorClicked = new EventEmitter();

  ngOnInit(): void {
  }

}
