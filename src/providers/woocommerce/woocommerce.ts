import { Injectable } from '@angular/core';

import * as WC from 'woocommerce-api';


/*
  Generated class for the WoocommerceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WoocommerceProvider {

  // Dev Local Config
  URL: any = "https://ideiasbrilhantes.local";
  CK: any = "ck_d75cfce1da28fcedd4afddeb0467c8b068f31dab";
  CS: any = "cs_53fb4f136bb0f559bad53e0d216b06660c6232af";

  // Prod Live Config
  // URL: any = "https://www.ideiasbrilhantes.info";
  // CK: any = "ck_bd7cce025bd54652a5b268cdd2b0b73e32a37231";
  // CS: any = "cs_ef9af07ee8acc9f6b99ba3046e8eadf34b2aaac5";

  WooCommerce: any;

  constructor() {
    this.WooCommerce = WC({
      url: this.URL,
      consumerKey: this.CK,
      consumerSecret: this.CS,
      // adicionei isto
      wpAPI: true,
      version: 'wc/v3'
    });
  }

  init(){
    return this.WooCommerce;
  }

}
