import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListingWantedMaterialPayload } from './models/listing-wanted-material';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  constructor(private httpClient: HttpClient) {}

  createWantedListing(payload: Partial<ListingWantedMaterialPayload>) {
    return this.httpClient.post('/listings', payload);
  }
}
