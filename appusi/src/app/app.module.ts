import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GererRidersComponent } from './gerer-riders/gerer-riders';
import { DefautComponent } from './defaut/defaut.component';
import { RidersService } from 'src/services/riders.service';
import { GlobalService } from 'src/services/global.services';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MenuInscriptionComponent } from './menu-inscription/menu-inscription.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GererCoursComponent } from './gerer-cours/gerer-cours.component';
import { GererSeanceComponent } from './gerer-seance/gerer-seance.component';
import { GererInscriptionsComponent } from './gerer-inscriptions/gerer-inscriptions.component';
import { MaSeanceComponent } from './ma-seance/ma-seance.component'; // Import du module MatFormFieldModule
import { SeancesService } from 'src/services/seances.service';
import { CoursService } from 'src/services/cours.service';
import { ErrorService } from 'src/services/error.service';
import { NotifJechaComponent } from './custom-notification/custom-notification.component';



@NgModule({
  declarations: [
    AppComponent
  , GererRidersComponent, DefautComponent, LoginComponent, MenuInscriptionComponent, GererCoursComponent, GererSeanceComponent, GererInscriptionsComponent, MaSeanceComponent, NotifJechaComponent],
  imports: [
    BrowserModule,HttpClientModule,
    AppRoutingModule, FormsModule, NoopAnimationsModule,
    BrowserAnimationsModule,MatCardModule,MatIconModule, MatFormFieldModule, MatSelectModule
  ],
  providers: [RidersService, GlobalService, SeancesService, CoursService, ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
