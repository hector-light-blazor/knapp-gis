import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as esriLoader from 'esri-loader';
import {ApiService} from "../api.service";

@Component({
  selector: 'knapp-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  @ViewChild('map') mapObj: ElementRef;
  @Input() options:any = null;
  @Input() changeMapSize:string="100%";
  map:any = null;
  programsLayer:any=null;
  programFeatureLayer:any = null;
  graphics:any=null;
  point:any=null;
  polygon:any=null;
  simpleSymbol:any=null;
  fillSymbol: any=null;
  lineSymbol: any=null;
  color:      any=null;
  infoTemp: any = null;
  geomEngine:any = null;
  heatRenderer:any = null;
  featureLayer:any = null;

  constructor(private _apiService: ApiService) { 

  }

  ngOnInit() {

    //Calculate Map Div
     this.calculateMapDiv();

    //Create Map
    this.createMap();
  }

  ngOnChanges() {
    
    if(this.options){
      console.log(this.options);
       switch (this.options.option) {
         case "dataTable":
           this.programFeatureLayer.hide();
           this.getSingleProgramLayer(this.options.program);
           break;
         case "subTable":
            this.programFeatureLayer.hide();
            this.getSingleGranteeLayer(this.options.grant.grant_id, this.options.grant.color);
            break;
         case "defaultMap":
            this.programFeatureLayer.show();
            this.programsLayer.clear();
            break;
         case "heatMap":
           console.log("I HERE YOU");
           this.makeDecision();
           break;
         default:
           break;
       }
    }
  }
  makeDecision(): void{
       this.programsLayer.clear();
       this.programFeatureLayer.clear();
       this.programFeatureLayer.show();

       if(this.options.heatMap == "ALL"){
         
          this.getScatterGrantPoints();
       }else {
          this.renderHeat();
       }
  }

  //Lets render Heat from the bucket selected....
  renderHeat():void{
     if("src" in this.options){
        let response = this.options.src;
        let size = this.options.src.length;
        let features = [];
      for(var i = 0; i < size; i++){
           var coor  = response[i].geom;
          
            //var json_build = JSON.parse(response[i].json_build_object);
           // var color = json_build.color;
            //STRING TO INT
            response[i].amount = parseFloat(response[i].amount);

           var att = { amount: response[i].amount};
           var pnt = new this.point(coor.coordinates);

           //var infoTemplate = new this.infoTemp(json_build.program, "${*}");
           var sym = new this.simpleSymbol(this.simpleSymbol.STYLE_SQUARE, 10,
            new this.lineSymbol(this.lineSymbol.STYLE_SOLID,
            new this.color.fromHex("#000000"), 1),
            new this.color.fromHex("#000000"));

           var graphic = new this.graphics(pnt, sym, att);
           features.push(graphic);
          


      }
      var self = this;
      //ADD ALL THE GRAPHICS TO THE FEATURE LAYER...
      this.programFeatureLayer.applyEdits(features, null, null);
       this.programFeatureLayer.redraw();
     }
     
  }

  //Lets calculate map div to put it on full screen perfect
  calculateMapDiv():void{
    let obj = document.getElementById("headerPanel");
    let bod = document.getElementsByTagName("BODY")[0];
    this.mapObj.nativeElement.style.width = ((bod.clientWidth - obj.clientWidth) - 2) + "px";
    if(this.map){
      this.map.reposition();
    }
  }

//Generate Map Div
  createMap():void{
    if(!this.map){

     esriLoader.dojoRequire(['esri/map',"esri/graphic","esri/InfoTemplate", 
     "esri/geometry/Point", "esri/geometry/Polygon", "esri/geometry/geometryEngineAsync",
     "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer", "esri/symbols/SimpleFillSymbol", 
     "esri/symbols/SimpleLineSymbol", "esri/Color","esri/symbols/SimpleMarkerSymbol", 
     "esri/renderers/ClassBreaksRenderer", "esri/renderers/HeatmapRenderer",], 
     (Map, Graphic,InfoTemplate,  Point, Polygon, geometryEngineAsync, 
      GraphicsLayer, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol, Color,
      SimpleMarkerSymbol, ClassBreaksRenderer, HeatmapRenderer) => {
        
       //Setup map...
          this.map = new Map(this.mapObj.nativeElement, {
            zoom: 8,
            center: [-97.990522, 26.158336],
            slider: false,
            showAttribution: false,
            basemap: "osm"
          });

          // To Check if we are in iframe
          if(this.inIframe()) {
            
              console.log("CARE FOUNDATION CALL ME ESRI MAP");
                //If in iframe disable mouse navigation...
              this.map.disableScrollWheelZoom();
              this.map.disableScrollWheel();
            
          }
         
        


          //GET GEOMETRY ENGINE OBJECT.....
          this.geomEngine = geometryEngineAsync;

          //GET FEATURE LAYER OBJECT.....
          this.featureLayer = FeatureLayer;

          //GET INFO TEMPLATE OBJECT 
          this.infoTemp = InfoTemplate;

          //GET HEAT RENDERER OBJECT
          this.heatRenderer = HeatmapRenderer;

          //Get Graphics Object
          this.graphics = Graphic;
          
          //GET Point Object...
          this.point = Point;

          //GET Polygon Object
          this.polygon = Polygon;
          
          //GET Simple, Fill, Line Symbol, and Color;
          this.fillSymbol = SimpleFillSymbol;
          this.lineSymbol = SimpleLineSymbol;
          this.color      = Color;

          this.simpleSymbol = SimpleMarkerSymbol

          //Create new Graphics Layer name Programs Layer....
          this.programsLayer = new GraphicsLayer();

          //Create new Feature Layer name Feature Programs Layer...

          this.createFeatureLayer();

          try {
               //GET SCATTER POINTS LATERS CHANGE TO HEAT MAP =>TODO
           this.getScatterGrantPoints();
          } catch (error) {
            
          }
         
     });

    }
  }


 inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
  }

  createFeatureLayer():void{
    //create a feature collection for the flickr photos
        let featureCollection = {
          "layerDefinition": null,
          "featureSet": {
            "features": [],
            "geometryType": "esriGeometryPoint"
          }
        };
        featureCollection.layerDefinition = {
          "geometryType": "esriGeometryPoint",
          "objectIdField": "ObjectID",
          "fields": [{
            "name": "ObjectID",
            "alias": "ObjectID",
            "type": "esriFieldTypeOID"
          }, {
            "name": "loc_name",
            "alias": "Location Name",
            "type": "esriFieldTypeString"
          }, {
            "name": "grant_recipient",
            "alias": "Grant",
            "type": "esriFieldTypeString"
          },
           {
            "name": "amount",
            "alias": "Amount",
            "type": "esriFieldTypeInteger"
          }
          ]
        };


        this.programFeatureLayer =  new this.featureLayer(featureCollection);

        this.map.addLayer(this.programFeatureLayer);
        this.map.addLayer(this.programsLayer);

  }

  getProgramLocations():void{
    this._apiService.GET_METHOD("programs/getLocationGrants/").subscribe((response:any) => {
       console.log(response);

      //Loop through the response information..
      let length = response.length;
      for(var i = 0; i < length; i++){

        var sfs = new this.fillSymbol(this.fillSymbol.STYLE_SOLID,
    new this.lineSymbol(this.lineSymbol.STYLE_SOLID,
    this.color.fromHex(response[i].color), 4),this.color.fromHex(response[i].color));

        var coor = JSON.parse(response[i].geom);
        var poly = new this.polygon(coor.coordinates[0]);
        var graphic = new this.graphics(poly, sfs);
        this.programsLayer.add(graphic);
       
      }
    })
  }

  getSingleProgramLayer(id):void{
    this.programsLayer.clear();
    let arrGeom = [];
    this._apiService.GET_METHOD("programs/getSingleProgramLocation/?id=" + id).subscribe(response => {
        //console.log(response);
        let length = response.length;
        for(var i = 0; i < length; i++){
            let color = response[i].color;

              let r = this.hexToR(color);
              let g = this.hexToG(color);
              let b = this.hexToB(color);

            var sfs = new this.fillSymbol(this.fillSymbol.STYLE_SOLID,
        new this.lineSymbol(this.lineSymbol.STYLE_SOLID,
        this.color.fromArray([r,g, b, 0.2]), 4),this.color.fromArray([r,g,b, 0.2]));

        var coor = JSON.parse(response[i].geom);
        var poly = new this.polygon(coor.coordinates[0]);

        //LETS SAVE THE POLYGONS IN THE TEMPORARY ARRAY FOR GET ZOOM EXTENT...
        arrGeom.push(poly);

        var graphic = new this.graphics(poly, sfs);
        this.programsLayer.add(graphic);
       
      }

      //LETS UNION ALL GEOMETRIES AND ZOOM TO EXTENT....

      this.geomEngine.union(arrGeom).then(response => {
          this.map.setExtent(response.getExtent());
      });
      


    });

  }

  getSingleGranteeLayer(id, color):void{
    this.programsLayer.clear();
    let arrGeom = [];
    this._apiService.GET_METHOD("grants/getSingleLocation/?id=" + id).subscribe(response => {

        let length = response.length;
        for(var i = 0; i < length; i++){

          let r = this.hexToR(color);
          let g = this.hexToG(color);
          let b = this.hexToB(color);

            var sfs = new this.fillSymbol(this.fillSymbol.STYLE_SOLID,
        new this.lineSymbol(this.lineSymbol.STYLE_SOLID,
        this.color.fromArray([r, g, b, 0.5]), 4),this.color.fromArray([r, g, b, 0.5]));

        var coor = JSON.parse(response[i].geom);
        var poly = new this.polygon(coor.coordinates[0]);
         //LETS SAVE THE POLYGONS IN THE TEMPORARY ARRAY FOR GET ZOOM EXTENT...
        arrGeom.push(poly);

        var graphic = new this.graphics(poly, sfs);
        this.programsLayer.add(graphic);
       
      }

       //LETS UNION ALL GEOMETRIES AND ZOOM TO EXTENT....
      this.geomEngine.union(arrGeom).then(response => {
          this.map.setExtent(response.getExtent());
      });

    });

  }

  getScatterGrantPoints():void{
   // this.programsLayer.clear();
     

    this._apiService.GET_METHOD("grants/getGrantsScatterPoints/").subscribe(response => {
      
      let size = response.length;
      let features = [];
      for(var i = 0; i < size; i++){
           var coor  = JSON.parse(response[i].geom);
          
           var json_build = JSON.parse(response[i].json_build_object);
            var color = json_build.color;
            //STRING TO INT
            response[i].amount = parseFloat(response[i].amount);

           var att = {grant: response[i].grant_recipient, amount: response[i].amount};
           var pnt = new this.point(coor.coordinates);

           var infoTemplate = new this.infoTemp(json_build.program, "${*}");
           var sym = new this.simpleSymbol(this.simpleSymbol.STYLE_SQUARE, 10,
             new this.lineSymbol(this.lineSymbol.STYLE_SOLID,
             new this.color.fromHex(color), 1),
             new this.color.fromHex(color));

           var graphic = new this.graphics(pnt, sym, att, infoTemplate);
           features.push(graphic);
           //this.programsLayer.add(graphic);

      }
      var self = this;
      //ADD ALL THE GRAPHICS TO THE FEATURE LAYER...
      this.programFeatureLayer.applyEdits(features, null, null, function(){

          //SET RENDERER

           var heatMap = new self.heatRenderer({field: "amount",
          blurRadius: 5,
          maxPixelIntensity: 40000,
          minPixelIntensity: 20
          });

       self.programFeatureLayer.setRenderer(heatMap);

          //Redraw so we can display the heat map....
           self.programFeatureLayer.redraw();
      });
      
      
    });
  }
   
   //THIS IS TO CONVERT HEX TO RGB BE ABLE TO USE ALPHA COLOR TRANSPARENT...
   cutHex(h:string) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
   hexToR(h:string)  {return parseInt((this.cutHex(h)).substring(0,2),16)}
   hexToG(h:string)  {return parseInt((this.cutHex(h)).substring(2,4),16)}
   hexToB(h:string)  {return parseInt((this.cutHex(h)).substring(4,6),16)}
 

}
