/* eslint-disable eqeqeq */
/* eslint-disable quote-props */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import { AuthenticationService } from '../services/authentication.service';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import jsPDF from 'jspdf';
import { toBase64String } from '@angular/compiler/src/output/source_map';
const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  public doughnutChartLabels = [''];
  public doughnutChartData = [0];
  public doughnutChartType = 'doughnut' as 'doughnut';
  public chartColors: any[] = [
    {
      backgroundColor:["#00CF83", "#001B6A", "#FAFFF2", "#FFFCC4", "#B9E8E0"]
    }];
  user: any;
  services: Services[];
  data: Data[];
  pdfjson: PDFJSON;
  chart = Chart;
  datachartbool=false;
  servicebool=false;
  databool=false;
  fiberstring ='';
  phonestring ='';
  tokenstring ='';

  constructor(private http: HttpClient,
    private router: Router,
    public authService: AuthenticationService) {}





  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }


  async ngOnInit(): Promise<void> {

    await Storage.get({key: TOKEN_KEY}).then((result) => {this.tokenstring=result.value;});
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ` + this.tokenstring

    });
    //console.log(localStorage.getItem('token'));

    console.log(headers);

    this.http.get('http://localhost:8000/api/user',{headers: headers}).subscribe(
      result=>{
        this.user=result;
        console.log("This is the user:");
        console.log(this.user.DNI);

        this.http.post('http://localhost:8000/api/services', this.user,{headers: headers}).subscribe(
          result=>{
            this.services=<Services[]>result;
            console.log("this is the result of get api/services: ");
            console.log(result);
            console.log("this is the result of this.services: ");
            console.log(this.services);

              if (this.services[0]!=null && this.services[0]!=undefined) {
                console.log("this is the result of data1: ");
                let data1 =this.services[0].data_type;
                console.log(data1);





                this.http.post('http://localhost:8000/api/data', this.user,{headers: headers}).subscribe(
                  result=>{
                    this.data=<Data[]>result;
                    console.log("this is the result of get api/data: ");
                    console.log(result);

                    if (this.data[0]!=null && this.data[0]!=undefined) {
                      if (this.services[0].data) {
                        this.datachartbool=true;
                        this.doughnutChartLabels = ['Datos usados (GigaBytes)', 'Datos restantes (GigaBytes)'];
                        this.doughnutChartData = [this.data[0].data/1000, (this.services[0].data_type/1000)-this.data[0].data/1000];

                      }

                      if (this.services[0].fiber) {
                        this.fiberstring =  ''+(this.data[0].fiber/1000);

                      }
                      if (this.services[0].phone) {
                        this.phonestring = '' + this.data[0].phone_minutes;
                      }




                    }else {this.databool=true;}

                  },
                  //result=>console.log(localStorage.getItem('token'))
                  err=>{
                    console.log(err);
                  }
                );

              }else {this.servicebool=true;}

          },
          //result=>console.log(localStorage.getItem('token'))
          err=>{
            console.log(err);
          }
        );









      },
      //result=>console.log(localStorage.getItem('token'))

      err=>{
        console.log(err);
        localStorage.removeItem('token');
        /*this.authService.logout();
        this.router.navigate(['/login']);*/
      }
    );
  }




}
export class Services{
  DNI: string;
  data: boolean;
  data_type: number;
  fiber: boolean;
  fiber_type: number;
  phone: boolean;
  phone_type: number;
  tv: boolean;
}
export class Data{
  DNI: string;
  date: Date;
  data: number;
  phone_minutes: number;
  messages: number;
  fiber: number;
}
export class PDFJSON{
  pdf: string;
}
