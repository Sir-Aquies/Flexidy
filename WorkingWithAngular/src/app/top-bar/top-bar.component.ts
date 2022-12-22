import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  mobileNav = false;
  constructor(private cart: CartService, private router: Router) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if (this.mobileNav === true) {
          this.showMobileNav();
        }
      }
    })
  }

  itemsAmount = 0;

  ngOnInit(): void {
    this.cart.cartlength.subscribe((value: number) => this.itemsAmount = value);
  }

  showMobileNav() {
    const nav = document.getElementById('mobile-navigation-bar') as HTMLDivElement;
    this.mobileNav = !this.mobileNav;

    if (this.mobileNav) {
      nav.style.left = '0';
      document.body.style.overflow = 'hidden';
    }
    else {
      nav.style.left = '-100%';
      document.body.style.overflow = 'auto';
    }
    
  }
}
