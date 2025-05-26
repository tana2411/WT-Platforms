import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UpdateCompanyPayload, UpdateProfilePayload } from 'app/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private httpClient: HttpClient) {}

  updateProfile(data: UpdateProfilePayload): Observable<any> {
    return this.httpClient.patch('/users/me', data);
  }

  updateCompany(id: number, data: UpdateCompanyPayload): Observable<any> {
    return this.httpClient.patch(`/companies/${id}`, data);
  }
}
