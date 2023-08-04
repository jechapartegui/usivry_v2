import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImportRidersComponent } from './import-riders/import-riders';
import { DefautComponent } from './defaut/defaut.component';
import { RidersService } from 'src/services/riders.service';
import { GlobalService } from 'src/services/global.services';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MenuInscriptionComponent } from './menu-inscription/menu-inscription.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  , ImportRidersComponent, DefautComponent, LoginComponent, MenuInscriptionComponent],
  imports: [
    BrowserModule,HttpClientModule,
    AppRoutingModule, FormsModule, NoopAnimationsModule,
    BrowserAnimationsModule,MatCardModule,MatIconModule
  ],
  providers: [RidersService, GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
