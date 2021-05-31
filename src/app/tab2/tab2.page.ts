/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable no-var */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable curly */
/* eslint-disable eqeqeq */
/* eslint-disable quote-props */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

import { DataService, Services, Data, PDFJSON } from '../services/data.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  user: any;
  services: Services[];
  data: Data[];
  pdfjson: PDFJSON;
  tokenstring ='';
  constructor(private http: HttpClient,
              private router: Router,
              public authService: AuthenticationService,
              public dataService: DataService) {
  }
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  waitFor(conditionFunction) {

    const poll = resolve => {
      if(conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 400);
    };
    return new Promise(poll);
  }


  public async generateInvoice(date: Date){
    await Storage.get({key: TOKEN_KEY}).then((result) => {this.tokenstring=result.value;});
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ` + this.tokenstring
    });
    const data = {
      'user': this.user,
      'date': date
    }
    this.http.post('http://localhost:8000/api/generateInvoice', data,{headers: headers}).subscribe(
          result=>{
            console.log("This is the base64 pdf:");
            console.log(result);
            if (result) {
              var pdfjson = <PDFJSON>result;
              var pdf = pdfjson.pdf;
              const linkSource = `data:application/pdf;base64,${pdf}`;
              const downloadLink = document.createElement("a");
              const fileName = "invoice.pdf";
              downloadLink.href = linkSource;
              downloadLink.download = fileName;
              downloadLink.click();
            }
          },
          err=>{
            console.log(err);
          }
        );
  }
  async ngOnInit(): Promise<void> {
    this.waitFor(_ => this.dataService.spinnerbool === false)
      .then(_ => {
        this.user = this.dataService.user;
        this.services=this.dataService.services
        this.data=this.dataService.data;
    });
  console.log("loaded");
  }
}
