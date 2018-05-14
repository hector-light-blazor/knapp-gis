import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { DataTableComponent } from './data-table/data-table.component';
import {ApiService} from "./api.service";
import { TableCardComponent } from './table-card/table-card.component';
import { LegendComponent } from './legend/legend.component';
import { ChartGraphsComponent } from './chart-graphs/chart-graphs.component';
import { ChartsModule } from 'ng2-charts';
import { DescriptionComponent } from './description/description.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EsriMapComponent,
    DataTableComponent,
    TableCardComponent,
    LegendComponent,
    ChartGraphsComponent,
    DescriptionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
