import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyInfo, HaulageRegistration, RegistrationResult, TradingRegistration } from 'app/models';
import { map, Observable } from 'rxjs';

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

  uploadFileHaulier(files: File[]): Observable<string> {
    const formData = new FormData();
    if (files.length > 0) {
      formData.append('file', files[0], files[0].name);
    }
    return this.httpClient.post<string>('/upload-file-haulier', formData, {
      responseType: 'text' as 'json',
    });
  }

  updateCompanyInfo(id: number, payload: Partial<CompanyInfo>) {
    return this.httpClient.patch<boolean>(`/companies/${id}`, payload).pipe(
      map((() => true)),
    );
  }
}
