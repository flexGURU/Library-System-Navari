import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book, ApiResponse, Member } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  apiUrl = environment.memberBaseUrl;

  constructor(private http: HttpClient) {}

  getMembers = (): Observable<Member[] | string> => {
    return this.http
      .get<ApiResponse<Member[]>>(`${this.apiUrl}.get_members`)
      .pipe(
        map((response) => {
          if ('error' in response.message) {
            return response.message.error;
          } else {
            return response.message;
          }
        })
      );
  };

  addMember = (memberData: Member): Observable<Member | string> => {
    return this.http
      .post<ApiResponse<Member>>(`${this.apiUrl}.create_member`, memberData)
      .pipe(
        map((response) => {
          if ('error' in response.message) {            
            return response.message.error;
          } else {
            return response.message;
          }
        })
      );
  };

  updateMember = (
    member_id: string,
    member_data: Member
  ): Observable<Member | string> => {
    return this.http
      .put<ApiResponse<Member>>(
        `${this.apiUrl}.update_member?member_id=${member_id}`,
        member_data
      )
      .pipe(
        map((response) => {
          if ('error' in response.message) {
            return response.message.error;
          } else {
            return response.message;
          }
        })
      );
  };

  deleteMember = (member_id: string): Observable<string> => {
    return this.http
      .delete<ApiResponse<string>>(
        `${this.apiUrl}.delete_member?member_id=${member_id}`
      )
      .pipe(
        map((response) => {
          if (
            typeof response.message === 'object' &&
            'error' in response.message
          ) {
            return response.message.error;
          } else {
            return response.message as string;
          }
        })
      );
  };
}
