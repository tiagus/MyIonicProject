import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
import { ProductDetails } from '../product-details/product-details';
import * as WC from 'woocommerce-api';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;

  @ViewChild('productSlides') productSlides: Slides;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private WP: WoocommerceProvider
    ) {

    this.page = 2;

    this.WooCommerce = WP.init();

    this.loadProducts();

    this.loadMoreProducts(null);

  }

  ionViewDidLoad(){
    setInterval( () => {
      if(this.productSlides.getActiveIndex() == this.productSlides.length() -1){
        this.productSlides.slideTo(0);
      }

      this.productSlides.slideNext();
    }, 3000)
  }

  loadProducts(){
    this.WooCommerce.getAsync("products").then( (data) => {
      this.products = JSON.parse(data.body);
    }, (err) => {
      console.log(err);
    })
  }

  loadMoreProducts(event){
    if(event == null){
      this.page = 2;
      this.moreProducts = [];
    } else {
      this.page ++;
    }

    this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body));

      if(event != null){
        event.complete();
        // event.target.complete();
      }

      if(JSON.parse(data.body).length < 10){
        event.enable(false);
        // event.target.disabled = true;
        // event.target.complete(); //works
        // event.enable(false); //gives error
        // event.target.enable(false); //gives error


        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();
      }

    }, (err) => {
      console.log(err);
    })
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetails, {"product": product})
  }

}



