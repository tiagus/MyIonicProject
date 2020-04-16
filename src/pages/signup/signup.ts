import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
//import * as WC from 'woocommerce-api';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {

  newUser: any = {};
  billing_shipping_same: boolean;
  WooCommerce: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private WP: WoocommerceProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
    ) {

    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
    this.billing_shipping_same = false;
    this.WooCommerce = WP.init();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  checkEmail(){

    let isEmailNew = false;
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(reg.test(this.newUser.email)){
      // email looks valid
      this.WooCommerce.getAsync("customers?email=" + this.newUser.email).then( (data) => {
        let res = (JSON.parse(data.body));

        if (res == '') {
          // new user, email does not exist
          isEmailNew = true;

        } else {
          // existing user, email already exists
          isEmailNew = false;

          this.toastCtrl.create({
            message: "Email already registered.",
            showCloseButton: true
          }).present();

        }

      })
    } else {
      // email is not valid, does not pass the regex text
      isEmailNew = false;

      this.toastCtrl.create({
        message: "Invalid Email. Please check.",
        showCloseButton: true
      }).present();

    }

  }

  signup(){

    if (this.billing_shipping_same) {
      this.newUser.shipping_address = this.newUser.billing_address;
    }

    let customerData = {
      customer : {}
    }

    customerData.customer = {
      "email": this.newUser.email,
      "first_name": this.newUser.first_name,
      "last_name": this.newUser.last_name,
      "username": this.newUser.username,
      "password": this.newUser.password,
      "billing": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": this.newUser.company,
        "address_1": this.newUser.billing_address.address_1,
        "address_2": this.newUser.billing_address.address_2,
        "city": this.newUser.billing_address.city,
        "state": this.newUser.billing_address.state,
        "postcode": this.newUser.billing_address.postcode,
        "country": this.newUser.billing_address.country,
        "email": this.newUser.email,
        "phone": this.newUser.phone
      },
      "shipping": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": this.newUser.company,
        "address_1": this.newUser.shipping_address.address_1,
        "address_2": this.newUser.shipping_address.address_2,
        "city": this.newUser.shipping_address.city,
        "state": this.newUser.shipping_address.state,
        "postcode": this.newUser.shipping_address.postcode,
        "country": this.newUser.shipping_address.country
      }
    }

    this.WooCommerce.postAsync("customers", customerData.customer).then( (data) => {

      let response = (JSON.parse(data.body));

      if (response.email == this.newUser.email) {

        this.alertCtrl.create({
          title: "Account Created",
          message: "Your account has been created successfully! Please login to proceed.",
          buttons: [{
            text: "Login",
            handler: ()=> {
              // todo
            }
          }]
        }).present();
      } else {
        this.toastCtrl.create({
          message: response.message,
          showCloseButton: true
        }).present();
      }

    })

  }






}
