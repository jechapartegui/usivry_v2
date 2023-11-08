import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { RidersService } from './riders.service';
import { environment } from 'src/environments/environment.prod';
import { ErrorService } from './error.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  
  

  constructor(private http: HttpClient, private datepipe:DatePipe) {}

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
      let date_ref_string = this.datepipe.transform(date_ref,"yyyy-MM-dd")
      let _varid:string = "0";
      const timeoutMilliseconds = 50000;
      if(RidersService.IsLoggedIn){
        _varid = RidersService.account.toString();
      }
    const password = _varid + date_ref_string; // Remplacez par le mot de passe à hacher
    const hashedPassword = CryptoJS.HmacSHA256(password, environment.password).toString(CryptoJS.enc.Hex);

      const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
  .set('password', hashedPassword)
  .set('dateref', date_ref_string)
  .set('userid', _varid)
  const response = await firstValueFrom(
    this.http.post(url, body, { headers }).pipe(
      timeout(timeoutMilliseconds),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          throw new Error('La requête a expiré en raison du délai dépassé.');
        } else {
          throw error; // Gérer d'autres erreurs ici
        }
      })
    )
  );
  return response;
} catch (error) {
      if (error instanceof HttpErrorResponse) {       
        this.handleError(error);
      } else {
        throw new Error('Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.');
      }
    }
  }

  private handleError(error: HttpErrorResponse): void {
    let message:string;
    if (error.error instanceof ErrorEvent) {

      message = error.error.message;
    } else {
      message =  error.statusText;
      
    }
    throw new Error(message);
  }
}
