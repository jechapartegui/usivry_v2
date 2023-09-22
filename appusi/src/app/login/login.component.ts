import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Remplacez par le chemin vers votre service RidersService
import { environment } from 'src/environments/environment.prod';
import { ErrorService } from 'src/services/error.service';
import { RidersService } from 'src/services/riders.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = environment.defaultlogin;
  password: string = environment.defaultpassword;
  stayLoggedIn: boolean = false;

  constructor(private ridersService: RidersService, private router: Router) { }

  ngOnInit(): void {
    if (RidersService.isLoggedIn == true) {
      this.router.navigate(['/menu-inscription']);
    }
  }

  RecupMDP() {
    // Appel à la méthode Check_Login du service RidersService
    const errorService = ErrorService.instance;
    const confirmation = window.confirm("Voulez-vous vraiment réinitialiser votre mot de passe ?");
    if(confirmation){
      this.ridersService.RecupMDP(this.username).then((retour: boolean) => {
        // Si la liste de riders est retournée (authentification réussie), rediriger vers la page "menu_inscription"
        if (retour) {
          let o = errorService.OKMessage("Réinitialisation du mot de passe");
          errorService.emitChange(o);
        } else {
          let o = errorService.CreateError("Réinitialisation du mot de passe", "Erreur inconnue");
          errorService.emitChange(o);
        }
      }).catch((error: Error) => {
        let o = errorService.CreateError("Réinitialisation du mot de passe", error.message);
        errorService.emitChange(o);
      });
    }
    
  }

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
        let o = errorService.CreateError("Connexion", "Erreur inconnue");
        errorService.emitChange(o);
        // Gérer le cas d'authentification échouée, par exemple, afficher un message d'erreur
        console.log('Identifiants invalides.');
      }
    }).catch((error: Error) => {
      let o = errorService.CreateError("Connexion", error.message);
      errorService.emitChange(o);
    });
  }
}
