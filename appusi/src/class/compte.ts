import { Rider } from "./riders";

export class compte{
    public id:number;
    public login:string;
    public mail_active:boolean;
    public registration_date:Date;
    public riders:Rider[];
}