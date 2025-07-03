import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FilterParams } from 'app/models';
import { GetMemberDetailResponse, GetMembersResponse, MemberRequestActionEnum } from 'app/types/requests/admin';

@Injectable()
export class AdminCommercialService {
  http = inject(HttpClient);

  getMembers(filter: FilterParams) {
    let params = new HttpParams();

    if (filter) {
      const encodedFilter = JSON.stringify(filter);
      params = params.set('filter', encodedFilter);
    }
    return this.http.get<GetMembersResponse>('/companies/new-members', {
      params,
    });
  }

  getMemberDetail(id: number) {
    return this.http.get<GetMemberDetailResponse>(`/users/admin/${id}`);
  }

  callAction({
    id,
    action,
    rejectionReason,
    message,
    requestInfo,
    sendMessage,
    otherMessage,
  }: {
    id: number;
    action: MemberRequestActionEnum;
    rejectionReason?: string;
    message?: string;

    requestInfo?: string;
    sendMessage?: string;
    otherMessage?: string;
  }) {
    if (action === MemberRequestActionEnum.REJECT) {
      return this.http.patch(`/users/admin/${id}/${action}`, {
        reject_reason: rejectionReason,
        message: !message?.trim() ? undefined : message,
      });
    }

    if (action === MemberRequestActionEnum.ACCEPT) {
      return this.http.patch(`/users/admin/${id}/${action}`, {});
    }

    return this.http.patch(`/users/admin/${id}/${action}`, {
      infoRequestType: message || requestInfo,
      message: otherMessage || sendMessage,
    });
  }
}
