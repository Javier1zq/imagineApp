/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-trailing-spaces */
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Router } from '@angular/router';
const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  user: any;
  services: Services[];
  data: Data[];
  pdfjson: PDFJSON;
  datachartbool=false;
  servicebool=false;
  databool=false;
  fiberstring ='';
  phonestring ='';
  tokenstring ='';
  spinnerbool= true;
  constructor(private http: HttpClient,
    private router: Router) { }
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
