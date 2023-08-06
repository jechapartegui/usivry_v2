import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StaticClass, code_alert } from './global';
import { ErrorService } from 'src/services/error.service';
import { notification } from './custom-notification/custom-notification.component';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(public Gl: StaticClass, private injector: Injector) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      retry(1),
      catchError((test_error) => {
        const errorService = this.injector.get(ErrorService);
        if(environment.production){
          console.log(test_error.status + " " + errorService.interpret_code_error(test_error.status) + " " + test_error.url);
        } else {
          let o = new notification();
          o.content = test_error.status + " " + errorService.interpret_code_error(test_error.status) + " " + test_error.url;
          o.object = "HTTP Error";
          o.color = code_alert.KO;
          errorService.emitChange(o);

        }
        throw test_error;
      })
    );
  }
}
