import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WorkingWithAngular';
  //TODO - create license page
  //TODO - create an explore page
  //TODO - fix the scroll position restauration problem.
  //TODO -  Add a way to buy images or get a subscription (not real money).
  onActivate() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

  }
}
