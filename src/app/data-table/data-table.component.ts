import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ApiService} from "../api.service";


@Component({
  selector: 'knapp-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() appdissappear:boolean;
  @Output() updatetable = new EventEmitter<boolean>();
  @Output() controlMap = new EventEmitter<any>();
  @Output() showComponents = new EventEmitter<any>();

  tableSummary:any;

  selected:any = null;
  subSelected:any = null;

  //SHOW DESCRIPTION..
  showDes:boolean = false;
  titleDes:string = "";
  bodyDes:string = "";
  displayBtn: boolean = false;

  constructor(private _apiService: ApiService) { }

  ngOnInit() {

    this.getSummaryReport();
  }

  getSummaryReport(){
      this._apiService.GET_METHOD("programs/getSummaryReport/").subscribe(response => {
        
        var length = response.length;
        for(var i = 0; i < length; i++){
           response[i].selection = JSON.parse(response[i].selection);
           response[i].grants_list = JSON.parse(response[i].grants_list);
           var len = response[i].grants_list.length;
           for(var x = 0; x < len; x++){
              response[i].grants_list[x].selection = JSON.parse(response[i].grants_list[x].selection);
           }
        }
      
          this.tableSummary = response;
      });

  }

  closeTable(){

    //DESELECT ANYTHING FROM TABLE..
    
    if(this.selected) this.selected.selection = false;

    if(this.subSelected) this.subSelected.selection = false;

    this.appdissappear = false;
    let options = {"option": "defaultMap"};
    this.controlMap.emit(options);
    this.updatetable.emit(false);

    
  }

  displayMap(object):void{

    if(this.selected){
      this.selected.selection = false;
    }

    if(this.subSelected){
      this.subSelected.selection = false;
      this.subSelected = null;
    }
    
    object.selection = true;
    this.selected = object;
    
    let options = {"option" : "dataTable", "program" : object.program_id, "total" : object.total};
    this.controlMap.emit(options);
  }

  controlmap(e:any):void{

    if(this.selected){
      this.selected.selection = false;
    }

    if(this.subSelected) {
      this.subSelected.selection = false;
    }

    this.selected = null;

    this.subSelected = e;
    let options = {"option" : "subTable", "grant" : e};
    this.controlMap.emit(options);
  }


  changeSize(value) {
    let  options = {"command" : value};
    this.showComponents.emit(options);
  }

  showDescription(program):void{
     this._apiService.GET_METHOD("programs/getProgramDescription/?id="+ program.program_id).subscribe(response => {
        this.showDes = true;
        this.titleDes = program.program_name;
        this.bodyDes = response.description;
     });
  }

}
