import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportRidersComponent } from './import-riders/import-riders';
import { DefautComponent } from './defaut/defaut.component';
import { LoginComponent } from './login/login.component';
import { MenuInscriptionComponent } from './menu-inscription/menu-inscription.component';

const routes: Routes = [
  { path: '', redirectTo: 'defaut', pathMatch: 'full' }, // Redirection vers 'defaut' pour le path vide
  { path: 'defaut', component: DefautComponent }, // Route 'defaut' qui affiche ImportRidersComponent
  { path: 'import-riders', component: ImportRidersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu-inscription', component: MenuInscriptionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
