import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(private cart: CartService) { }

  itemsAmount = 0;

  ngOnInit(): void {
    this.cart.cartlength.subscribe((value: number) => this.itemsAmount = value);
  }

}
