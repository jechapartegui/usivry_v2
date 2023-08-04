import { Component, OnInit } from '@angular/core';
import { Rider } from 'src/class/riders';
import { RidersService } from 'src/services/riders.service';

@Component({
  selector: 'app-menu-inscription',
  templateUrl: './menu-inscription.component.html',
  styleUrls: ['./menu-inscription.component.css']
})
export class MenuInscriptionComponent implements OnInit {
  riders: Rider[] = []; // Initialisez la variable riders avec les données de vos riders

  constructor() { }

  ngOnInit() {
    this.riders = RidersService.ListeRiders;
    // Ici, vous pouvez initialiser la variable riders en récupérant les données depuis votre service RidersService
    // Par exemple, si vous avez une méthode getRiders() dans votre service, vous pouvez faire :
    // this.riders = this.ridersService.getRiders();
  }

  // Fonction pour calculer l'âge en fonction de la date de naissance
  calculateAge(dateNaissance: Date): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  onCardClick(rider){
    
  }

}