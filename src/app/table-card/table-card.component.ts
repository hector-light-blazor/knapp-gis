import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'knapp-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.css']
})
export class TableCardComponent implements OnInit {

  @Input() grantees:any;
  @Input() id:any;
  @Output() notifytable = new EventEmitter<any>();
  size:number=0;
  selected:any=null;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    this.size = changes.grantees.length;
  
  }

  onClickGrantee(row){
    console.log(this.selected);
    if(this.selected){
      this.selected.selection = false;
    }


    row.selection = true;
    this.selected = row;
    
    this.notifytable.emit(row);
  }

}
