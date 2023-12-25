import { Component, OnInit } from '@angular/core';
import { Cours } from 'src/class/cours';
import { Seance, Seance_VM, StatutSeance } from 'src/class/seance';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { CoursService } from 'src/services/cours.service';
import { SeancesService } from 'src/services/seances.service';
import { ErrorService } from 'src/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RidersService } from 'src/services/riders.service';
import { Router } from '@angular/router';
import { notification } from '../custom-notification/custom-notification.component';
import { Groupe } from 'src/class/groupe';
import { GroupeService } from 'src/services/groupe.service';
import { LieuService } from 'src/services/lieu.service';
import { lieu } from 'src/class/lieu';

@Component({
  selector: 'app-gerer-seance',
  templateUrl: './gerer-seance.component.html',
  styleUrls: ['./gerer-seance.component.css']
})
export class GererSeanceComponent implements OnInit {
  listeCours: Cours[] = []; // Initialisez la liste des cours (vous pouvez la charger à partir d'une API, par exemple)
  listelieu: KeyValuePair[] = []; // Initialisez la liste des lieux (vous pouvez la charger à partir d'une API, par exemple)
  listeprof: KeyValuePair[] = []; // Initialisez la liste des lieux (vous pouvez la charger à partir d'une API, par exemple)
  prof_dispo: KeyValuePair[] = []; // Initialisez la liste des lieux (vous pouvez la charger à partir d'une API, par exemple)
  list_seance: Seance[] = []; // Initialisez la liste des séances (vous pouvez la charger à partir d'une API, par exemple)
  editMode = false;
  editMode_serie: boolean = false;
  list_seance_VM: Seance_VM[] = [];
  editSeance: Seance_VM | null = null;
  est_prof: boolean = false;
  est_admin: boolean = false;
  season_id: number;
  jour_semaine: string = "";
  list_saison: KeyValuePair[];
  current_prof: number;
  coursselectionne: boolean = false;
  afficher_menu_admin: boolean = false;
  current_groupe_id: number;
  groupe_dispo: Groupe[] = [];
  list_groupe: Groupe[] = []

  action: string;

  filter_libelle: string = "";
  filter_active_libelle: boolean = false;
  sort_libelle: "NO" | "ASC" | "DESC" = "NO";

  filter_cours: number;
  filter_active_cours: boolean = false;
  sort_cours: "NO" | "ASC" | "DESC" = "NO";

  filter_date: Date;
  filter_active_date: boolean = false;
  sort_date: "NO" | "ASC" | "DESC" = "NO";

  filter_prof: number;
  filter_active_prof: boolean = false;

  filter_groupe: number;
  filter_active_groupe: boolean = false;

  sort_heure: "NO" | "ASC" | "DESC" = "NO";

  filter_lieu: KeyValuePair;
  filter_active_lieu: boolean = false;
  sort_lieu: "NO" | "ASC" | "DESC" = "NO";
  listeStatuts: StatutSeance[];

  constructor(
    private router: Router,
    private coursservice: CoursService,
    private seancesservice: SeancesService,
    private lieuservice: LieuService,
    private grServ: GroupeService,
    private errorservice: ErrorService
  ) { }

  ngOnInit(): void {
    const errorService = ErrorService.instance;
    if (RidersService.IsLoggedIn === false) {
      this.router.navigate(['/login']);
      return;
    }
    this.est_prof = RidersService.Est_Prof;
    this.est_admin = RidersService.Est_Admin;

    if (RidersService.Est_Prof === false && RidersService.Est_Admin === false) {
      this.router.navigate(['/menu-inscription']);
      return;
    }
    this.listeStatuts  = Object.keys(StatutSeance).map(key => StatutSeance[key]);
    this.grServ.GetAll().then((groupes) => {
      this.list_groupe = groupes;
      this.coursservice.GetSaison().then((saisons) => {
        this.list_saison = saisons;
        this.coursservice.GetCours().then((list) => {
          this.listeCours = list;
          this.lieuservice.GetAllLight().then((list) => {
            this.listelieu = list;

            this.seancesservice.GetAllSeances().then((list) => {
              this.list_seance = list;
              this.list_seance_VM = list.map(x => new Seance_VM(x));
            }).catch((err: HttpErrorResponse) => {
              let o =  errorService.CreateError("récupérer les séances", err.statusText);
              errorService.emitChange(o);
              this.router.navigate(['/menu-inscription']);
            })
          }).catch((err: HttpErrorResponse) => {
            let o = errorService.CreateError("récupérer les lieux", err.statusText);
            errorService.emitChange(o);
            this.router.navigate(['/menu-inscription']);
          })
        }).catch((err: HttpErrorResponse) => {
          let o = errorService.CreateError("récupérer les cours", err.statusText);
          errorService.emitChange(o);
          this.router.navigate(['/menu-inscription']);
        })
      }).catch((err: HttpErrorResponse) => {
        let o = errorService.CreateError("récupérer les saisons", err.statusText);
        errorService.emitChange(o);
        this.router.navigate(['/menu-inscription']);
      })
    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError("récupérer les groupes", err.statusText);
      errorService.emitChange(o);
      this.router.navigate(['/menu-inscription']);
    });
  }



  AjouterProf() {
    let kvp = this.prof_dispo.filter(e => e.key == this.current_prof)[0];
    console.log(kvp);
    this.editSeance.professeurs.push(kvp);
    this.current_prof = null;
    this.MAJListeProf();
  }
  RemoveProf(item) {
    this.editSeance.professeurs = this.editSeance.professeurs.filter(e => e.key !== item.key);
    this.MAJListeProf();
  }
  MAJListeProf() {
    this.prof_dispo = this.listeprof;
    this.editSeance.professeurs.forEach(element => {
      let element_to_remove = this.listeprof.find(e => e.key == element.key);
      if (element_to_remove) {
        this.prof_dispo = this.prof_dispo.filter(e => e.key !== element_to_remove.key);
      }
    });
  }
  AjouterGroupe() {
    const indexToUpdate = this.list_groupe.findIndex(cc => cc.id === this.current_groupe_id);
    const newValue = this.list_groupe[indexToUpdate];
    this.editSeance.groupes.push(newValue);
    this.current_groupe_id = null;
    this.MAJListeGroupe();

  }
  RemoveGroupe(item) {
    this.editSeance.groupes = this.editSeance.groupes.filter(e => e.id !== item.id);
    this.MAJListeGroupe();
  }
  MAJListeGroupe() {
    this.groupe_dispo = this.list_groupe;

    this.editSeance.groupes.forEach((element: Groupe) => {
      let element_to_remove = this.list_groupe.find(e => e.id == element.id);
      if (element_to_remove) {
        this.groupe_dispo = this.groupe_dispo.filter(e => e.id !== element_to_remove.id);
      }
    });
  }


  Edit(seance: Seance_VM): void {
    var this_seance = this.list_seance.find(x => x.seance_id == seance.seance_id);
    this.editSeance = new Seance_VM(this_seance);
    this.coursselectionne = true;
    this.editMode = true;
    this.MAJListeProf();
    this.MAJListeGroupe();
  }
  onCoursSelectionChange(cours_id: any): void {
    //  console.log('Nouvelle valeur sélectionnée :', newValue);
    if (!isNaN(cours_id)) {
      const indexToUpdate = this.listeCours.findIndex(cc => cc.id === cours_id);
      const newValue = this.listeCours[indexToUpdate];
      this.coursselectionne = true;
      this.editSeance.duree_seance = newValue.duree;
      this.editSeance.age_requis = newValue.age_requis;
      this.editSeance.age_maximum = 99;
      this.editSeance.libelle = newValue.nom;
      this.editSeance.heure_debut = newValue.heure;
      this.editSeance.convocation_nominative = newValue.convocation_nominative;
      this.editSeance.place_maximum = newValue.place_maximum;
      this.editSeance.groupes = [];
      newValue.groupes.forEach((el) => {
        this.editSeance.groupes.push(el);
      })
      this.editSeance.lieu_id = newValue.lieu_id;
      this.jour_semaine = newValue.jour_semaine;
    } else {
      this.coursselectionne = false;
    }
    this.MAJListeGroupe();
    // Faites ce que vous voulez avec la nouvelle valeur sélectionnée ici
  }

  isProfInEditSeance(prof: KeyValuePair): boolean {
    return this.editSeance.professeurs.some(p => p.value === prof.value);
  }



  Creer(serie: boolean = false): void {
    this.editSeance = new Seance_VM(new Seance());
    this.coursselectionne = false;
    if (serie) {
      this.editMode_serie = true;
    }
    this.editMode = true;
    this.MAJListeProf();
    this.MAJListeGroupe();
  }

  VoirMaSeance() {
    let confirmation = window.confirm("Voulez-vous aller vers la vue du professeur ? les modifications non sauvegardées seront perdues");
    if (confirmation) {
      this.router.navigate(['/ma-seance'], { queryParams: { id: this.editSeance.seance_id } });

    }
  }

  AjouterSerie() {

    this.editMode_serie = false;
  }
  TerminerSeance() {
    let confirmation = window.confirm("Voulez-vous aller vers la vue du professeur ? les modifications non sauvegardées seront perdues");
  }



  Sort(sens: "NO" | "ASC" | "DESC", champ: string) {

    switch (champ) {
      case "libelle":
        this.sort_libelle = sens;
        if (this.sort_libelle != "NO") {
          this.list_seance_VM.sort((a, b) => {
            const nomA = a.libelle.toUpperCase(); // Ignore la casse lors du tri
            const nomB = b.libelle.toUpperCase();

            let comparaison = 0;
            if (nomA > nomB) {
              comparaison = 1;
            } else if (nomA < nomB) {
              comparaison = -1;
            }

            return this.sort_libelle === 'ASC' ? comparaison : -comparaison; // Inverse pour le tri descendant
          });

        }
        break;
      case "lieu":
        this.sort_lieu = sens;
        if (this.sort_lieu != "NO") {
          this.list_seance_VM.sort((a, b) => {
            const lieuA = this.listelieu.find(lieu => lieu.key === a.lieu_id)?.value || '';
            const lieuB = this.listelieu.find(lieu => lieu.key === b.lieu_id)?.value || '';

            // Ignorer la casse lors du tri
            const lieuAUpper = lieuA.toUpperCase();
            const lieuBUpper = lieuB.toUpperCase();

            let comparaison = 0;
            if (lieuAUpper > lieuBUpper) {
              comparaison = 1;
            } else if (lieuAUpper < lieuBUpper) {
              comparaison = -1;
            }

            return this.sort_lieu === 'ASC' ? comparaison : -comparaison; // Inverse pour le tri descendant
          });
        }
        break;
      case "cours":
        this.sort_cours = sens;
        if (this.sort_cours != "NO") {
          this.list_seance_VM.sort((a, b) => {
            const coursA = this.listeCours.find(x => x.id === a.cours)?.nom || '';
            const coursB = this.listeCours.find(x => x.id === b.cours)?.nom || '';

            // Ignorer la casse lors du tri
            const coursAUpper = coursA.toUpperCase();
            const coursBUpper = coursB.toUpperCase();

            let comparaison = 0;
            if (coursAUpper > coursBUpper) {
              comparaison = 1;
            } else if (coursAUpper < coursBUpper) {
              comparaison = -1;
            }

            return this.sort_cours === 'ASC' ? comparaison : -comparaison; // Inverse pour le tri descendant
          });
        }
        break;
      case "heure":
        this.sort_heure = sens;
        if (this.sort_heure != "NO") {
          this.list_seance_VM.sort((a, b) => {

            const nomA = a.heure_debut.toUpperCase(); // Ignore la casse lors du tri
            const nomB = b.heure_debut.toUpperCase();

            let comparaison = 0;
            if (nomA > nomB) {
              comparaison = 1;
            } else if (nomA < nomB) {
              comparaison = -1;
            }

            return this.sort_heure === 'ASC' ? comparaison : -comparaison; // Inverse pour le tri descendant
          });
        }
        break;
      case "date":
        this.sort_date = sens;
        if (this.sort_date != "NO") {
          this.list_seance_VM.sort((a, b) => {

            const nomA = a.date_seance; // Ignore la casse lors du tri
            const nomB = b.date_seance;

            let comparaison = 0;
            if (nomA > nomB) {
              comparaison = 1;
            } else if (nomA < nomB) {
              comparaison = -1;
            }

            return this.sort_date === 'ASC' ? comparaison : -comparaison; // Inverse pour le tri descendant
          });
        }
        break;
    }


  }


  Reinit(thisl: Seance_VM) {
    let confirmation = window.confirm($localize`Cette action annulera l'ensemble des modifications sur cet adhérent ?`);
    if (confirmation) {
      const seance_avant: Seance = this.list_seance.find(x => x.seance_id === thisl.seance_id);
      const index_seance_apres: number = this.list_seance_VM.findIndex(x => x.seance_id === thisl.seance_id);

      if (seance_avant !== undefined && index_seance_apres !== -1) {
        this.list_seance_VM[index_seance_apres] = new Seance_VM(seance_avant);
      }
    }

  }

  Delete(seance: Seance_VM): void {
    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ?');

    if (isConfirmed) {

      const errorService = ErrorService.instance;
      this.action = "Supprimer une séance";
      if (seance) {
        this.seancesservice.Delete(seance.seance_id).then((retour) => {
          if (retour) {
            this.list_seance = this.list_seance.filter(x => x.seance_id !== seance.seance_id);
            this.list_seance_VM = this.list_seance_VM.filter(x => x.seance_id !== seance.seance_id);
            let o = errorService.OKMessage(this.action);
            errorService.emitChange(o);
          } else {
            let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
            errorService.emitChange(o);
          }
        }).catch((err) => {
          let o = errorService.CreateError(this.action, err.statusText);
          errorService.emitChange(o);
        });
      }
    }
  }




  Save(seance: Seance_VM) {
    const errorService = ErrorService.instance;
    this.action = "Ajouter une séance";
    let se: Seance = seance.ToSeance()
    if (seance) {
      if (seance.seance_id == 0) {

        this.seancesservice.Add(se).then((id) => {
          if (id) {
            se.seance_id = id;
            this.list_seance.push(se);
            let se_vm: Seance_VM = new Seance_VM(se);
            this.list_seance_VM.push(se_vm);
            if (this.editMode = true) {
              this.editSeance = se_vm;
            }
            let o = errorService.OKMessage(this.action);
            errorService.emitChange(o);
          } else {
            let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
            errorService.emitChange(o);
          }

        }).catch((err) => {
          let o = errorService.CreateError(this.action, err.statusText);
          errorService.emitChange(o);
        });
      }
      else {
        this.seancesservice.Update(se).then((ok) => {

          this.action = "Mettre à jour un rider";
          if (ok) {

            const indexToUpdate = this.list_seance.findIndex(s => s.seance_id === se.seance_id);
            if (indexToUpdate !== -1) {
              // Remplacer l'élément à l'index trouvé par la nouvelle valeur
              this.list_seance[indexToUpdate] = se;
            }
            const indexToUpdateVM = this.list_seance_VM.findIndex(s => s.seance_id === se.seance_id);
            if (indexToUpdateVM !== -1) {
              // Remplacer l'élément à l'index trouvé par la nouvelle valeur
              this.list_seance_VM[indexToUpdateVM] = seance;
            }

            let o = errorService.OKMessage(this.action);
            errorService.emitChange(o);
            if (this.editMode) {
              const isConfirmed = window.confirm($localize`Poursuivre les modifications ?`);
              if (!isConfirmed) {
                this.editMode = false;
              }
            }
          } else {
            let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
            errorService.emitChange(o);
          }

        }).catch((err) => {
          let o = errorService.CreateError(this.action, err.statusText);
          errorService.emitChange(o);
        });
      }
    }
  }

  Retour(): void {
    let confirmation = window.confirm("En quittant cet écran, vous perdez les données non sauvegardées. Confirmez vous l'opération ?");
    if (confirmation) {
      this.editSeance = null;
      this.editMode = false;
    }
  }
  Filtrer() {
    let errorservice = ErrorService.instance;
    this.seancesservice.GetAllSeances(true).then((result) => {
      this.list_seance_VM = result.map(x => new Seance_VM(x));
      let o = errorservice.OKMessage("Recherche de séances");
      errorservice.emitChange(o);
    }).catch((elkerreur: HttpErrorResponse) => {
      let o = errorservice.CreateError("Recherche de séances", elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }
  FiltrerBack() {
    let errorservice = ErrorService.instance;
    this.seancesservice.GetSeance().then((result) => {
      this.list_seance_VM = result.map(x => new Seance_VM(x));
      let o = errorservice.OKMessage("Recherche de séances");
      errorservice.emitChange(o);
    }).catch((elkerreur: HttpErrorResponse) => {
      let o = errorservice.CreateError("Recherche de séances", elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }
}
