/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quote-props */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-trailing-spaces */
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
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

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

  public getData(){
    return Data;
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
                        this.doughnutChartLabels = ['Data used (GigaBytes)', 'Remaining data (GigaBytes)'];
                        this.doughnutChartData = [this.data[0].data/1000, (this.services[0].data_type/1000)-this.data[0].data/1000];

                      }

                      if (this.services[0].fiber) {
                        this.fiberstring = 'This month you have used ' + this.data[0].fiber/1000 + ' (GigaBytes) out of unlimited';

                      }
                      if (this.services[0].phone) {
                        this.phonestring = 'This month you have used ' + this.data[0].phone_minutes + ' minutes out of unlimited';
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
