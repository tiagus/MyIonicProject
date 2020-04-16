import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetails } from '../product-details/product-details';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategory {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private WP: WoocommerceProvider
    ) {

    this.page = 1;
    this.category = this.navParams.get("category");

    this.WooCommerce = WP.init();

    this.loadProducts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategory');
  }

  loadProducts(){
    this.WooCommerce.getAsync("products?category=" + this.category.id).then( (data) => {
      this.products = JSON.parse(data.body);
    }, (err) => {
      console.log(err);
    })
  }

  loadMoreProducts(event){
    this.page ++;

    this.WooCommerce.getAsync("products?category=" + this.category.id + "&page=" + this.page).then( (data) => {
      let temp = JSON.parse(data.body);

      this.products = this.products.concat(JSON.parse(data.body));
      event.complete();

      if(temp.length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();
      }
    })
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetails, {"product": product})
  }

}
