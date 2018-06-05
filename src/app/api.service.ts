import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs';
import {Observable, Subscription} from 'rxjs/';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  mainURL:string = "https://gis.lrgvdc911.org/php/knapp/index.php/";

  constructor(private _http: Http) { }

   GET_METHOD(site){
      return this._http.get(this.mainURL + site).
      pipe(map((response: Response)=> response.json()));
  }
}
