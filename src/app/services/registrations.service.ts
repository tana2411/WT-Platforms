import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyInfo, CompanyLocation, HaulageRegistration, RegistrationResult, TradingRegistration } from 'app/models';
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

  uploadFileHaulier(files: File[]): Observable<string[]> {
    const formData = new FormData();
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file, file.name);
      });
    }
    return this.httpClient.post<string[]>('/upload-file-haulier', formData, {
      // responseType: 'text' as 'json',
    });
  }

  uploadMultiFile(files: File[]): Observable<string[]> {
    const formData = new FormData();
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file, file.name);
      });
    }
    return this.httpClient.post<string[]>('/upload-multiple-files', formData, {
      // responseType: 'text' as 'json',
    });
  }

  updateCompanyDocuments(payload: any) {
    return this.httpClient.post('/company-documents', payload);
  }

  updateCompanyInfo(id: number, payload: Partial<CompanyInfo>) {
    return this.httpClient.patch<boolean>(`/companies/${id}`, payload).pipe(map(() => true));
  }

  updateCompanyLocation(payload: Partial<CompanyLocation>) {
    return this.httpClient.post('/company-locations', payload);
  }
}
