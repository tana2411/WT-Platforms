import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HaulageRegistration, RegistrationResult, TradingRegistration } from 'app/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationsService {
  constructor(private httpClient: HttpClient) {}

  registerTrading(payload: Partial<TradingRegistration>) {
    return this.httpClient.post<RegistrationResult>('/register-trading', payload);
  }

  registerHaulage(payload: Partial<HaulageRegistration>) {
    return this.httpClient.post<RegistrationResult>('/register-haulier', payload);
  }

  uploadFileHaulier(payload: File[]): Observable<string> {
    console.log(payload);

    const formData = new FormData();
    payload.forEach((file) => {
      formData.append('file', file, file.name);
    });
    return this.httpClient.post<string>('/upload-file-haulier', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}
