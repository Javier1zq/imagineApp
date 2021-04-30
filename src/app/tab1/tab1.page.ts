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
import { DataService, Services, Data } from '../services/data.service';
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
  public labelColors = ["#FFFFFF"];
  public chartColors: any[] = [
    {
      backgroundColor:["#00CF83", "#001B6A", "#FAFFF2", "#FFFCC4", "#B9E8E0"]
    }];
  public lineChartOptions: any = {
  legend : {
      labels : {
        fontColor : '#ffffff'
      }
    }
  };
  user: any;
  services: Services[];
  data: Data[];
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

  waitFor(conditionFunction) {

    const poll = resolve => {
      if(conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 400);
    };
    return new Promise(poll);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }


  async ngOnInit(): Promise<void> {
    this.waitFor(_ => this.dataService.spinnerbool === false)
      .then(_ => {
        this.user = this.dataService.user;
        this.services=this.dataService.services
        this.data=this.dataService.data;
        if (this.data[0]!=null && this.data[0]!=undefined) {
          if (this.services[0].data) {
            this.datachartbool=true;
            this.doughnutChartLabels = ['Datos usados (GigaBytes)', 'Datos restantes (GigaBytes)'];
            this.doughnutChartData = [this.data[0].data/1000, (this.services[0].data_type/1000)-this.data[0].data/1000];
          }
          if (this.services[0].fiber) {
            this.fiberstring = '' + this.data[0].fiber/1000;
          }
          if (this.services[0].phone) {
            this.phonestring = '' + this.data[0].phone_minutes;
          }
        }else {this.databool=true;}
    });
  console.log("loaded");
  }
}

