import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { environment } from '@app/environments';
import { Observable } from 'rxjs';


export function apiBaseUrlInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const apiReq = request.clone({ url: `${environment.apiUrl}${request.url}` });
  return next(apiReq);
}