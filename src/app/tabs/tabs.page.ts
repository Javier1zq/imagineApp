/* eslint-disable max-len */
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
import { DataService } from '../services/data.service';

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
    public authService: AuthenticationService,
    public dataService: DataService) {}


  async ngOnInit(): Promise<void> {
    await Storage.get({key: TOKEN_KEY}).then((result) => {this.tokenstring=result.value;});
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ` + this.tokenstring
    });
    this.http.get('http://192.168.0.16:8000/api/user',{headers: headers}).subscribe(
      result=>{
        this.dataService.user=result;
        this.http.post('http://192.168.0.16:8000/api/services', this.dataService.user,{headers: headers}).subscribe(
          result=>{
            this.dataService.services=<Services[]>result;
              if (this.dataService.services[0]!=null && this.dataService.services[0]!=undefined) {
                this.http.post('http://192.168.0.16:8000/api/data', this.dataService.user,{headers: headers}).subscribe(
                  result=>{
                    this.dataService.data=<Data[]>result;
                    if (this.dataService.data[0]!=null && this.dataService.data[0]!=undefined) {
                      if (this.dataService.services[0].data) {
                        this.dataService.datachartbool=true;
                        this.doughnutChartLabels = ['Data used (GigaBytes)', 'Remaining data (GigaBytes)'];
                        this.doughnutChartData = [this.dataService.data[0].data/1000, (this.dataService.services[0].data_type/1000)-this.dataService.data[0].data/1000];
                      }
                      if (this.dataService.services[0].fiber) {
                        this.dataService.fiberstring = '' + this.dataService.data[0].fiber/1000;
                      }
                      if (this.dataService.services[0].phone) {
                        this.dataService.phonestring = '' + this.dataService.data[0].phone_minutes;
                      }
                    }else {this.dataService.databool=true;}
                    this.dataService.spinnerbool=false;
                  },
                  err=>{
                    console.log(err);
                  }
                );
              }else {this.dataService.servicebool=true;}
          },
          err=>{
            console.log(err);
          }
        );
      },
      err=>{
        console.log(err);
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
