import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import {Observable, Subscription} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  mainURL:string = "https://gis.lrgvdc911.org/php/knapp/index.php/";

  constructor(private _http: Http) { }

   GET_METHOD(site){
      return this._http.get(this.mainURL + site).map((response: Response)=> response.json());
  }
}
