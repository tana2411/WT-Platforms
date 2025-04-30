import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HaulageRegistration, TradingRegistration } from 'app/models';

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

  registerHaulage(payload: Partial<HaulageRegistration>) {
    return this.httpClient.post('/register-haulier', payload);
  }

}
