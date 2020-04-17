import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  username: string;
  password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public storage: Storage,
    public alertCtrl: AlertController
    ) {

    this.username = "";
    this.password = "";

    }

    login(){

      this.http.get("https://dev.tiagodossantos.com/headlesswoo/api/auth/generate_auth_cookie/?username=" + this.username + "&password=" + this.password)
      .subscribe( (res) => {
        console.log(res);

        let response = res;

        // if (response.error) {
        //   this.toastCtrl.create({
        //     message: response.error,
        //     duration: 5000
        //   }).present();
        //   return;
        // }

        this.storage.set("userLoginInfo", response).then( (data) => {

          this.alertCtrl.create({
            title: "Login Successful",
            message: "You have been logged in successfully.",
            buttons: [{
              text: "OK",
              handler: () => {
                if (this.navParams.get("next")) {
                  this.navCtrl.push(this.navParams.get("next"));
                } else {
                  this.navCtrl.pop();
                }
              }
            }]
          }).present();

        })


      });
    }

}



