import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Remplacez par le chemin vers votre service RidersService
import { Rider } from 'src/class/riders';
import { ErrorService } from 'src/services/error.service';
import { RidersService } from 'src/services/riders.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  stayLoggedIn: boolean = false;

  constructor(private ridersService: RidersService, private router: Router) {}

  Login() {
    // Appel à la méthode Check_Login du service RidersService
    const errorService = ErrorService.instance;
    this.ridersService.Login(this.username, this.password, this.stayLoggedIn).then((retour: boolean) => {
      // Si la liste de riders est retournée (authentification réussie), rediriger vers la page "menu_inscription"
      if (retour) {
        let o = errorService.OKMessage("Connexion");
        errorService.emitChange(o);
        this.router.navigate(['/menu-inscription']);
      } else {
        // Gérer le cas d'authentification échouée, par exemple, afficher un message d'erreur
        console.log('Identifiants invalides.');
      }
    });
  }
}
