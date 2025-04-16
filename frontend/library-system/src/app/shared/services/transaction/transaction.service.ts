import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse, Transaction } from '../../models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  apiUrl = environment.transactionBaseUrl;

  constructor(private http: HttpClient) {}

  getTransactions = (): Observable<Transaction[] | string> => {
    return this.http
      .get<ApiResponse<Transaction[]>>(`${this.apiUrl}.get_transaction`)
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

  issueBook = (
    book_name: string,
    email: string
  ): Observable<Transaction | string> => {
    return this.http
      .post<ApiResponse<Transaction>>(`${this.apiUrl}.issue_book`, {
        book_name,
        email,
      })
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

  returnBook = (
    transaction_id: string,
    rent_fee: number
  ): Observable<Transaction | string> => {
    return this.http
      .post<ApiResponse<Transaction>>(`${this.apiUrl}.return_book`, {
        transaction_id,
        rent_fee,
      })
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
}
