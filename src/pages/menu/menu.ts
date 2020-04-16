import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProductsByCategory } from '../products-by-category/products-by-category';
import { Signup } from '../signup/signup';
import { Login } from '../login/login';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
import { Storage } from '@ionic/storage';
import { Cart } from '../cart/cart';



@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {

  homePage: any;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavController: NavController;
  loggedIn: boolean;
  user: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private WP: WoocommerceProvider,
    public storage: Storage,
    public modalCtrl: ModalController
    ) {
    this.homePage = HomePage;
    this.categories = [];
    this.user = {};

    this.WooCommerce = WP.init();

    this.WooCommerce.getAsync("products/categories").then( (data) => {
      let temp: any[] = JSON.parse(data.body);
      for (let i = 0; i < temp.length; i++) {
        if(temp[i].parent == 0){

          if(temp[i].slug == "automobiles-motocycle"){
            temp[i].icon = "car-outline";
          }
          if(temp[i].slug == "consumer-electronics"){
            temp[i].icon = "phone-portrait-outline";
          }
          if(temp[i].slug == "electrical-tools"){
            temp[i].icon = "construct-outline";
          }
          if(temp[i].slug == "health-beauty"){
            temp[i].icon = "rose-outline";
          }
          if(temp[i].slug == "home-garden"){
            temp[i].icon = "home-outline";
          }
          if(temp[i].slug == "tv-audio"){
            temp[i].icon = "easel-outline";
          }
          if(temp[i].slug == "uncategorized"){
            temp[i].icon = "build-outline";
          }

          this.categories.push(temp[i]);
        }
      }
    }, (err) => {
      console.log(err);
    })

  }

  ionViewDidEnter() {

    this.storage.ready().then( () => {
      this.storage.get("userLoginInfo").then( (userLoginInfo) => {
        if (userLoginInfo != null) {
          console.log("User logged in...");
          this.user = userLoginInfo.user;
          console.log(this.user);
          this.loggedIn = true;
        } else {
          console.log("No user found.");
          this.user = {};
          this.loggedIn = false;
        }
      })
    })

  }

  openCategoryPage(category){
    this.childNavController.setRoot(ProductsByCategory, { "category": category});
  }

  openPage(pageName: string){
    if (pageName == "signup") {
      this.navCtrl.push(Signup);
    }

    if (pageName == "login") {
      this.navCtrl.push(Login);
    }

    if (pageName == "logout") {
      this.storage.remove("userLoginInfo").then( () => {
        this.user = {};
        this.loggedIn = false;
      })
    }

    if (pageName == "cart") {
      let modal = this.modalCtrl.create(Cart);
      modal.present();
    }

  }

}
