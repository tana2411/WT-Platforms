import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetMemberDetailResponse, GetMembersParams, GetMembersResponse } from 'app/types/requests/admin';

@Injectable()
export class AdminCommercialService {
  http = inject(HttpClient);

  getMembers({ page, pageSize }: GetMembersParams) {
    return this.http.get<GetMembersResponse>('/companies/new-members', {
      params: {
        filter: JSON.stringify({
          skip: (page - 1) * pageSize,
          limit: pageSize,
        }),
      },
    });
  }

  getMemberDetail(id: number) {
    return this.http.get<GetMemberDetailResponse>(`/users/admin/${id}`);
  }
}
