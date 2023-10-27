import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NotifJechaComponent } from './custom-notification/custom-notification.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StaticClass } from 'src/global';
import { ErrorService } from 'src/services/error.service';
import { GlobalService } from 'src/services/global.services';
import { TeamService } from 'src/services/team.service';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    NotifJechaComponent],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, 
    FormsModule, NgbModule
  ],
  providers: [GlobalService, TeamService, ErrorService, StaticClass, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
