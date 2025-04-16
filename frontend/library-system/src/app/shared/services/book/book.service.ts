import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse, Book } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  apiUrl = environment.bookBaseUrl;

  constructor(private http: HttpClient) {}

  getBooks = (): Observable<Book[] | string> => {
    return this.http.get<ApiResponse<Book[]>>(`${this.apiUrl}.get_book`).pipe(
      map((response) => {
        if ('error' in response.message) {
          return response.message.error;
        } else {
          return response.message;
        }
      })
    );
  };

  addBook = (bookData: Book): Observable<Book | string> => {
    return this.http
      .post<ApiResponse<Book>>(`${this.apiUrl}.create_book`, bookData)
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

  updateBook = (
    book_id: string,
    book_data: Book
  ): Observable<Book | string> => {
    const encodedTitle = encodeURIComponent(book_id);
    console.log(`${this.apiUrl}.update_book?book_name=${book_id}`);

    return this.http
      .put<ApiResponse<Book>>(
        `${this.apiUrl}.update_book?book_name=${book_id}`,
        book_data
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

  deleteBook = (book_id: string): Observable<string> => {
    return this.http
      .delete<ApiResponse<string>>(
        `${this.apiUrl}.delete_book?book_name=${book_id}`
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
