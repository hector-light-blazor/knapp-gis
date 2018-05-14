import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'knapp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() showComponents = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
  
  //Handles what component to display in page...
  showComponent(selection:number):void{
    let options = {};
     switch (selection) {
       case 1:
         options = {"command" : "LEGEND"};
         this.showComponents.emit(options);
         break;

       case 3:
          options = {"command" : "CHARTS"};
          this.showComponents.emit(options);
       break;

       case 4:
          options = {"command" : "TABLE"};
          this.showComponents.emit(options);
       break;

       default:
         break;
     }
  }

}
