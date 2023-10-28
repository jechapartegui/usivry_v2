import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';

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
      
    const password = _varid + date_ref_string; // Remplacez par le mot de passe à hacher
    const hashedPassword = CryptoJS.HmacSHA256(password, environment.password).toString(CryptoJS.enc.Hex);

      const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
  .set('password', hashedPassword)
  .set('dateref', date_ref_string)
  .set('userid', _varid)
      const response = await firstValueFrom(this.http.post(url, body, { headers }));
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleError(error);
      } else {
        console.error('Something went wrong:', error);
        throw new Error('Something went wrong.');
      }
    }
  }

  private handleError(error: HttpErrorResponse): void {
    let errorservice = ErrorService.instance;
    if (error.error instanceof ErrorEvent) {
      let o = errorservice.CreateError('Something went wrong:', error.error.message);
      errorservice.emitChange(o);
    } else {
      let o = errorservice.CreateError('Something went wrong:', error.statusText);
      errorservice.emitChange(o);
      
    }
    throw new Error(error.statusText);
  }
}
