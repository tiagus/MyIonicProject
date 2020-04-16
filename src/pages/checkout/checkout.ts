import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
import { HomePage } from '../home/home';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class Checkout {

  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[] = [];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private WP: WoocommerceProvider,
    public alertCtrl: AlertController,
    public payPal: PayPal,
    ) {

    this.newOrder = {};
    this.newOrder.billing = {};
    this.newOrder.shipping = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      {method_id: 'bacs', method_title: "Direct Bank Transfer"},
      {method_id: 'cheque', method_title: "Cheque Payment"},
      {method_id: 'cod', method_title: "Cash on Delivery"},
      ];

    this.WooCommerce = WP.init();

    this.storage.get("userLoginInfo").then( (userLoginInfo) => {
      this.userInfo = userLoginInfo.user;
      let email = userLoginInfo.user.email;

      // customers?email=john.does@example.com
      this.WooCommerce.getAsync("customers?email=" + email).then( (data) => {
        this.newOrder = (JSON.parse(data.body)[0]);
      })



    })

  }


  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;
    if (this.billing_shipping_same) {
      this.newOrder.shipping = this.newOrder.billing;
    }
  }

  placeOrder(){

    let orderItems: any[] = [];
    let data: any = {};

    let paymentData: any = {};

    this.paymentMethods.forEach( (element, index) => {

      if (element.method_id == this.paymentMethod) {
        paymentData = element;
      }

    });

    data = {

      payment_method: paymentData.method_id,
      payment_method_title: paymentData.method_title,

      //set_paid: false,
      //status: "pending",

      billing: this.newOrder.billing,

      shipping: this.newOrder.shipping,

      customer_id: this.userInfo.id || '0', //if has id it's a user if not it's a guest

      line_items: orderItems
    };

    console.log("data object", data);

    if (paymentData.method_id == "paypal") {


      this.payPal.init({
        PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
        PayPalEnvironmentSandbox: 'IAaODEohcG0g0KmzNArn3EUyKmxtaO8NeCMpEMVgAI17Bi4Pl9TUJ10BbdiCr_BgXu1vH8njujJZOqT-X'
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {

          //added by me
          this.storage.get("cart").then( (cart) => {

            let total = 0.00;
            cart.forEach( (element, index) => {
              orderItems.push({ product_id: element.product.id, quantity: element.qty });
              total = total + (element.product.price * element.qty);
            });


            let payment = new PayPalPayment(total.toString(), 'EUR', 'Description', 'sale');
            this.payPal.renderSinglePaymentUI(payment).then( (response) => {
              // Successfully paid
              console.log(JSON.stringify(response));

              data.line_items = orderItems;
              console.log(data);
              let orderData: any = {};

              orderData.order = data;

              this.WooCommerce.postAsync('orders', orderData, (err, data, res) => {
                alert("Order placed successfully!");

                let response = (JSON.parse(data.body));

                this.alertCtrl.create({
                  title: "Order Placed Successfully",
                  message: "Your order has been placed successfully. Your order number is " + response.id,
                  buttons: [{
                    text: "OK",
                    handler: () => {
                      this.navCtrl.setRoot(HomePage);
                    }
                  }]
                }).present();

              })

            })

          }, () => {
            // Error or render dialog closed without being successful
          });
        }, () => {
          // Error in configuration
        });
      }, () => {
        // Error in initialization, maybe PayPal isn't supported or something else
      });












    } else {

      this.storage.get("cart").then( (cart) => {
        cart.forEach( (element, index) => {
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });

        data.line_items = orderItems;

        let orderData: any = {};

        orderData = data;

        this.WooCommerce.postAsync("orders", orderData).then( (data) => {

          let response = (JSON.parse(data.body));

          this.alertCtrl.create({
            title: "Order Placed Successfully",
            message: "Your order has been placed successfully. Your order number is " + response.id,
            buttons: [{
              text: "OK",
              handler: () => {
                this.navCtrl.setRoot(HomePage);
              }
            }]
          }).present();

        })

      })

    }

  }

}












