import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';

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
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
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
    console.log(error.error.text);
    if (error.error instanceof ErrorEvent) {
      console.error('Une erreur s\'est produite:', error.error.message);
    } else {
      console.error(
        `Code d'erreur ${error.status}, ` +
        `message d'erreur: ${error.error}`);
    }
    throw new Error('Une erreur s\'est produite. Veuillez réessayer plus tard.');
  }
}
