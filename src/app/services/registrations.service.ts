import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradingRegistration } from 'app/models';

@Injectable({
  providedIn: 'root'
})
export class RegistrationsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  registerTrading(payload: Partial<TradingRegistration>) {
    return this.httpClient.post('/register-trading', payload);
  }

}
