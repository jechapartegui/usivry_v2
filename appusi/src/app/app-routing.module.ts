import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GererRidersComponent } from './gerer-riders/gerer-riders';
import { DefautComponent } from './defaut/defaut.component';
import { LoginComponent } from './login/login.component';
import { MenuInscriptionComponent } from './menu-inscription/menu-inscription.component';
import { GererSeanceComponent } from './gerer-seance/gerer-seance.component';
import { GererCoursComponent } from './gerer-cours/gerer-cours.component';
import { AdministrationComponent } from './administration/administration.component';
import { MaSeanceComponent } from './ma-seance/ma-seance.component';
import { GererGroupeComponent } from './gerer-groupe/gerer-groupe.component';
import { GererCompteComponent } from './gerer-compte/gerer-compte.component';

const routes: Routes = [
 // { path: '', redirectTo: 'defaut', pathMatch: 'full' }, // Redirection vers 'defaut' pour le path vide
  { path: '', component: DefautComponent }, // Route 'defaut' qui affiche ImportRidersComponent
  { path: 'defaut', component: DefautComponent }, // Route 'defaut' qui affiche ImportRidersComponent
  { path: 'gerer-riders', component: GererRidersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu-inscription', component: MenuInscriptionComponent },
  { path: 'ma-seance', component: MaSeanceComponent },
  {path:'gerer-seance', component:GererSeanceComponent},
  {path:'gerer-cours', component:GererCoursComponent},
  {path:'administration', component:AdministrationComponent},
  {path:'gerer-groupe', component:GererGroupeComponent},
  {path:'gerer-compte', component:GererCompteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
