import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { TableCardComponent } from './table-card/table-card.component';
import { DescriptionComponent } from './description/description.component';
import { ChartGraphsComponent } from './chart-graphs/chart-graphs.component';
import { DataTableComponent } from './data-table/data-table.component';
import { HeaderComponent } from './header/header.component';
import { LegendComponent } from './legend/legend.component';
import { ChartsModule } from 'ng2-charts';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    TableCardComponent,
    DescriptionComponent,
    ChartGraphsComponent,
    DataTableComponent,
    HeaderComponent,
    LegendComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
