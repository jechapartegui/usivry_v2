import { Component, OnInit } from '@angular/core';
import { Cours } from 'src/class/cours';
import { Seance } from 'src/class/seance';

@Component({
  selector: 'app-defaut',
  templateUrl: './defaut.component.html',
  styleUrls: ['./defaut.component.css']
})
export class DefautComponent implements OnInit {
  public cours:Cours[] = [];
  public seances:Seance[] = [];
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  Essayer(seance:Seance){

  }
}
