import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { SingularProductComponent } from './singular-product/singular-product.component';
import { CarouselComponent } from './carousel/carousel.component';
import { FooterComponent } from './footer/footer.component';
import { ProductPageComponent } from './product-page/product-page.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    ProductsListComponent,
    HomeComponent,
    CartComponent,
    SingularProductComponent,
    CarouselComponent,
    FooterComponent,
    ProductPageComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, AppRoutingModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent },
      { path: "products", component: ProductsListComponent },
      { path: "cart", component: CartComponent },
      { path: 'product/:productName', component: ProductPageComponent }
    ], { scrollPositionRestoration: 'top' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
