export class table_view{
    colonnes :colonne_view[] = [];
}

export class colonne_view{
    name:string = "";
    label:string="";
    value_type:"TEXTE" | "NOMBRE" | "BOOLEAN" | "LISTE" | "DATE"| "SEXE"= "TEXTE";
    visible:boolean = false;
    values:any[];
    order:number = 1;
    sort:"ASC" | "DESC" | "NO" = "NO";
}