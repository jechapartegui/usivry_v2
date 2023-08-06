import { Component } from '@angular/core';
import { Cours } from 'src/class/cours';
import { Niveau } from 'src/class/riders';

@Component({
  selector: 'app-gerer-cours',
  templateUrl: './gerer-cours.component.html',
  styleUrls: ['./gerer-cours.component.css']
})
export class GererCoursComponent {
  // cours.component.ts

  listeCours: Cours[] = []; // Initialisez la liste des cours (vous pouvez la charger à partir d'une API, par exemple)
  editMode = false;
  editCours: Cours | null = null;
  niveauxRequis: Niveau[] = Object.values(Niveau);

  // Méthode pour trouver un professeur à partir de son ID
  trouverProfesseur(profId: number): any {
    // Implémentez la logique pour trouver le professeur à partir de la liste des professeurs
    // que vous pouvez stocker dans une variable
    return null;
  }

  // Méthode pour trouver un gymnase à partir de son ID
  trouverGymnase(gymId: number): any {
    // Implémentez la logique pour trouver le gymnase à partir de la liste des gymnases
    // que vous pouvez stocker dans une variable
    return null;
  }

  editerCours(cours: Cours): void {
    this.editCours = { ...cours };
    this.editMode = true;
  }

  supprimerCours(cours: Cours): void {
    // Implémentez la logique pour supprimer le cours de la liste (ou de l'API)
    // this.listeCours = this.listeCours.filter((c) => c.id !== cours.id);
  }

  creerCours(): void {
    this.editCours = new Cours(0, '', '', '', 0, 0, 0, 0, []);
    this.editMode = true;
  }

  soumettreCours(): void {
    if (this.editCours) {
      // Implémentez la logique pour soumettre les modifications ou créer un nouveau cours
      // Si this.editCours.id est différent de 0, c'est une mise à jour, sinon, c'est une création
      // this.editCours contient les valeurs du formulaire
    }
    this.editMode = false;
  }

  annulerEdition(): void {
    this.editMode = false;
    this.editCours = null;
  }
}
