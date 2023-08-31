import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';
import { RidersService } from './riders.service';
import { environment } from 'src/environments/environment.prod';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  
  

  constructor(private http: HttpClient) {}

  public async GET(url:string): Promise<any> {
   
    try {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const response = await firstValueFrom(this.http.get(url));
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleError(error);
      } else {
        console.error('Une erreur inattendue s\'est produite:', error);
        throw new Error('Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.');
      }
    }
  }
  public async POST(url: string, body: any): Promise<any> {

    try {
      let date_ref = new Date();
      let date_ref_string = date_ref.toDateString();
      let _varid:string = "0";
      if(RidersService.IsLoggedIn){
        _varid = RidersService.account.toString();
      }
    const password = _varid + date_ref_string; // Remplacez par le mot de passe à hacher
    const hashedPassword = CryptoJS.HmacSHA256(password, environment.password).toString(CryptoJS.enc.Hex);

      const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
  .set('password', hashedPassword)
  .set('date_ref', date_ref_string)
  .set('user_id', _varid)
      const response = await firstValueFrom(this.http.post(url, body, { headers }));
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleError(error);
      } else {
        console.error('Une erreur inattendue s\'est produite:', error);
        throw new Error('Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.');
      }
    }
  }

  private handleError(error: HttpErrorResponse): void {
    let errorservice = ErrorService.instance;
    if (error.error instanceof ErrorEvent) {
      let o = errorservice.CreateError('Une erreur s\'est produite:', error.error.message);
      errorservice.emitChange(o);
    } else {
      let o = errorservice.CreateError('Une erreur s\'est produite:', error.statusText);
      errorservice.emitChange(o);
      
    }
    throw new Error(error.statusText);
  }
}
