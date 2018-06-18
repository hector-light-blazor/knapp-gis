import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ApiService} from "../api.service";
//import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'knapp-chart-graphs',
  templateUrl: './chart-graphs.component.html',
  styleUrls: ['./chart-graphs.component.css']
})
export class ChartGraphsComponent implements OnInit {
  @Output() cntDisplay = new EventEmitter<boolean>();
  holdSelection: string = "";
  nameReport:string = "Yearly Report";

   //Variables that control the canvas for bar options...
   public barChartColors:Array<any> =[];
   public barChartOptions:any = {
    
    scaleShowVerticalLines: false,
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
            
            if(tooltipItem.yLabel) {
              return "$" + Number(tooltipItem.yLabel).toFixed(0).replace(/./g, function(c, i, a) {
                var ans = i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                //console.log(ans);
                return ans;
            });
            }
            else {
              console.log(data);
              var answer = "$" + Number(data.datasets[0].data[tooltipItem.index]).toFixed(0).replace(/./g, function(c, i, a) {
                var ans = i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                //console.log(ans);
                return ans;
            });

            return answer + "\n" + data.labels[tooltipItem.index]

            }

            
        }
    }
    },
    responsive: true,
     scales: {
        xAxes: [{
          ticks: {}
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            
           	// Return an empty string to draw the tick line but hide the tick label
           	// Return `null` or `undefined` to hide the tick line entirely
           	userCallback: function(value, index, values) {
              // Convert the number to a string and splite the string every 3 charaters from the end
              value = value.toString();
              value = value.split(/(?=(?:...)*$)/);
              
              // Convert the array to a string and format the output
              value = value.join(',');
              //console.log(value);
              return '$' + value;
            }
          }
        }]
      }
  }
  
  public barChartLabels:any = [];
  
  public barChartType:string = 'line';
  public barChartLegend:boolean = false;
  public barChartData:any[] = [
    {data: [], label: "Year's Invested"}
  ];
  constructor(private _apiService: ApiService) { }

  ngOnInit() {

    this.getListYears();
    this.getTotalsByYears();
  }

  getListYears(){
     this._apiService.GET_METHOD("grants/getListYears").subscribe(response =>{
        console.log(response);
        this.barChartLabels = response;
        this.barChartColors = [{backgroundColor: '#00aa01'}];
     });
  }

  getTotalsByYears(){
    this._apiService.GET_METHOD("grants/getTotalsByYears/").subscribe(response =>{
        response[response.length] = 0;
        console.log(response);
        this.barChartData = [
          {data: response, label: "Year's Invested"}
        ]
    });
  }

  closeCharts(){
    this.cntDisplay.emit(false);
  }

  changeChartType(selection:string) {
    switch (selection) {
      case "line":
        this.barChartType = selection;
        this.changeReport(this.holdSelection);
        break;
      case "bar":
        this.barChartType = selection;
        this.changeReport(this.holdSelection);
        break;
      case "radar":
        this.barChartType = selection;
        this.changeReport(this.holdSelection);
        break;
      case "pie":
        this.barChartType = selection;
        this.changeReport(this.holdSelection);
        break;
      case "polarArea":
        this.barChartType = selection;
        this.changeReport(this.holdSelection);
        break
      default:
        break;
    }
  }

  changeReport(selection:string):void{
    switch (selection) {
      case "p":
        this.nameReport = "Areas of Interest Report";
        this.holdSelection = selection;
        this.getProgramBarReport();
        break;
      case 'y':
         this.holdSelection = selection;
         this.nameReport = "Yearly Report";
         this.getListYears();
         this.getTotalsByYears();
        break;
      case 'r':
         this.holdSelection = selection;
         this.nameReport = "Region Report";
         this.getRegionBarReport();
         break;
      default:
        break;
    }
  }


  getRegionBarReport(){

    this._apiService.GET_METHOD("generate/programBarByCityReport/").subscribe(response => {
        console.log(response);
        let names = response.name;
         this.barChartData = [];
        
          this.barChartColors = [{backgroundColor: '#0064b4'}];
         let _self = this;
         setTimeout(function() {
            _self.barChartLabels = null;
            _self.barChartLabels = names;
          }, 10);

        this.barChartData = [
          {data: response.money, label: "Region Invested"}
        ]
        

    });

  }

  getProgramBarReport(){
    this._apiService.GET_METHOD("generate/programBarReport/").subscribe(response => {
      let names = response.name;
      this.barChartData = [];
      let _self = this;
        setTimeout(function() {
           _self.barChartLabels = null;
           _self.barChartLabels = names;
        }, 10);

        this.barChartColors = [{backgroundColor: response.colors}];
        console.log(response.colors);
        this.barChartData = [{data: response.money, label: "Programs Impact"}];
        
    });
  }

}
