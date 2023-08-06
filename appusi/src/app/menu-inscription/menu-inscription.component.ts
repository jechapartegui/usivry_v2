import { Component, OnInit } from '@angular/core';
import { Inscription, InscriptionSeance, StatutPresence } from 'src/class/inscription';
import { Rider } from 'src/class/riders';
import { Seance } from 'src/class/seance';
import { RidersService } from 'src/services/riders.service';
import { SeancesService } from 'src/services/seances.service';

@Component({
  selector: 'app-menu-inscription',
  templateUrl: './menu-inscription.component.html',
  styleUrls: ['./menu-inscription.component.css']
})
export class MenuInscriptionComponent implements OnInit {
  Riders: Rider[] = []; // Initialisez la variable riders avec les données de vos riders
  Seances: Seance[] = []; // La liste des séances
  selectedSeanceId: number | null = null; // L'ID de la séance sélectionnée dans la liste déroulante
  MesSeancesProf:Seance[];
  constructor(private seanceService: SeancesService) {}

  ngOnInit() {
    this.Riders = RidersService.ListeRiders;
   //charger seance

   //charger inscription par rider

   // charger mes seances prof si y'a un prof
  }
    
     
  
    // Fonction pour ajouter une séance à un rider
    onAddSession(rider: Rider, seance:Seance) {
      if (seance !== null) {

          const inscription: Inscription = {
            rider_id: rider.id,
            seance_id: seance.id,
            id: 0,
            date_inscription: undefined,
            statut: StatutPresence.Présent
          };
          this.seanceService.inscrire(inscription);
        }
    }
    Absent(rider: Rider) {
      if (this.selectedSeanceId !== null) {
        const selectedSeance = this.Seances.find((seance : Seance) => seance.id === this.selectedSeanceId);
        if (selectedSeance) {
          const inscription: Inscription = {
            rider_id: rider.id,
            seance_id: selectedSeance.id,
            id: 0,
            date_inscription: undefined,
            statut: StatutPresence.Absent
          };
          this.seanceService.inscrire(inscription);
        }
      }
    }
  
    // Fonction pour retirer une séance d'un rider
    onRemoveSession(rider: Rider, inscr: InscriptionSeance) {
      const selectedSeance = rider.inscriptions.find((seance : InscriptionSeance) => seance.seance_id === inscr.seance_id);
      if (selectedSeance) {
        const inscription: Inscription = {
          rider_id: rider.id,
          seance_id: selectedSeance.id,
          id: 0,
          date_inscription: undefined,
          statut: StatutPresence.Absent
        };
        this.seanceService.desinscrire(inscription);
      }
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