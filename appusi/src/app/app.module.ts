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
import {MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MenuInscriptionComponent } from './menu-inscription/menu-inscription.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { GererCoursComponent } from './gerer-cours/gerer-cours.component';
import { GererSeanceComponent } from './gerer-seance/gerer-seance.component';
import { GererInscriptionsComponent } from './gerer-inscriptions/gerer-inscriptions.component';
import { PopInEssai } from './defaut/defaut.component';
import { MaSeanceComponent } from './ma-seance/ma-seance.component'; // Import du module MatFormFieldModule
import { SeancesService } from 'src/services/seances.service';
import { CoursService } from 'src/services/cours.service';
import { ErrorService } from 'src/services/error.service';
import { NotifJechaComponent } from './custom-notification/custom-notification.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StaticClass } from './global';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { GererGroupeComponent } from './gerer-groupe/gerer-groupe.component';
import { SimulationMailComponent } from './simulation-mail/simulation-mail.component';
import { GererCompteComponent } from './gerer-compte/gerer-compte.component';



@NgModule({
  declarations: [
    AppComponent
  , GererRidersComponent, DefautComponent, LoginComponent, MenuInscriptionComponent, MaSeanceComponent, GererCoursComponent, GererSeanceComponent, GererInscriptionsComponent, MaSeanceComponent, NotifJechaComponent, PopInEssai, GererGroupeComponent, SimulationMailComponent, GererCompteComponent],
  imports: [
    BrowserModule,HttpClientModule,
    AppRoutingModule, FormsModule, NoopAnimationsModule,
    BrowserAnimationsModule,MatCardModule,MatIconModule, MatFormFieldModule, MatSelectModule,MatCheckboxModule, NgbModule, MatDialogModule, MatSlideToggleModule
  ],
  providers: [RidersService, GlobalService, SeancesService, CoursService, ErrorService, StaticClass, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
