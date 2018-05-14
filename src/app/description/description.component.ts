import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'knapp-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  
  @Input() description:string = "TEST";
  @Input() title:string = "HELLO WORLD";
  @Output() clDesc = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  closeDescription(){
    this.clDesc.emit(true);
  }

}
