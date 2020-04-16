import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
import { Cart } from '../cart/cart';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetails {

  product: any;
  WooCommerce: any;
  reviews: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public storage: Storage,
    private WP: WoocommerceProvider,
    public modalCtrl: ModalController
    ) {

    this.product = this.navParams.get("product");

    this.WooCommerce = WP.init();

    this.loadReviews(this.product.id)

  }

  loadReviews(elem){
    this.WooCommerce.getAsync("products/reviews/?product=" + elem).then( (data) => {
      this.reviews = JSON.parse(data.body);
    }, (err) => {
      console.log(err);
    })
  }

  addToCart(product){
    this.storage.get("cart").then( (data) => {

      if(data == null || data.length == 0){
        data = [];
        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
      } else {
        let added = 0;
        for (let i = 0; i < data.length; i++) {
          if(product.id == data[i].product.id){
            let qty = data[i].qty;
            data[i].qty = qty+1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }
        }

        if (added == 0) {
          data.push({
            "product": product,
            "qty": 1,
            "amount": parseFloat(product.price)
          });
        }
      }

      this.storage.set("cart", data).then( () => {
        this.toastCtrl.create({
          message: "Cart Updated",
          duration: 3000
        }).present();
      })

    });
  }

  openCart(){
    this.modalCtrl.create(Cart).present();
  }

}





