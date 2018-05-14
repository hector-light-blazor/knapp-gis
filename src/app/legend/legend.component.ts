import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ApiService} from "../api.service";


@Component({
  selector: 'knapp-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  @Output() closeTbl = new EventEmitter<boolean>();
  @Output() heatMapOptions = new EventEmitter<any>();

  bucket:string = "ALL";
  constructor(private _apiService: ApiService) { }

  ngOnInit() {
  }


  closeTable():void{
    this.closeTbl.emit(false);
  }
  handleChange(event):void{

    console.log(event);
    let bucket = event.target.value || event.srcElement.value //Check what property is availabe fire fox hack
    console.log(bucket);
    //bucket = bucket.attributes.value  || bucket.value; //get the value...
    let options = {option: "heatMap", heatMap: bucket};
    console.log(options);
    if(bucket != "ALL"){
          //LETS GET THE DATA FROM SERVER.....
        this._apiService.GET_METHOD("grants/generateHeatMapForXBucket/?bucket=" + bucket).subscribe(response => {
           
            console.log("I RETURNED");
            let len = response.length;
            for(var i = 0; i < len; i++){
               response[i].geom = JSON.parse(response[i].geom);
            }
              options["src"] = response;
              this.heatMapOptions.emit(options);
        });
    }else{
      this.heatMapOptions.emit(options);
    }

  
  }
}
