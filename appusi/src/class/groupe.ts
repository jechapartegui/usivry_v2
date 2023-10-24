import { Rider } from "./riders";

export class Groupe{
    public id:number;
    public nom:string;
    public saison_id:number;
}

export class Groupe_Lie extends Groupe{
    public riders:Rider[] =[];
}

export class Lien_Groupe {
    public groupe:number[];
    public objet_id:number;
    public objet_type:string;

}

