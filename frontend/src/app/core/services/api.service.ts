import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MessageService } from 'primeng/api'; // Import Message Service
import { environment } from '../../../environments/environment'; // Import environment for API URL

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private messageService: MessageService) { }

  // A generic error handler function
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred!';

    // Check if Django sent a specific JSON error message
    if (error.error && error.error.error) {
      errorMsg = error.error.error;
    } else if (error.error && error.error.detail) {
      errorMsg = error.error.detail;
    } else {
      errorMsg = error.message;
    }

    // Trigger the PrimeNG Red Error Toast
    this.messageService.add({ severity: 'error', summary: 'Action Failed', detail: errorMsg, life: 5000 });

    return throwError(() => new Error(errorMsg));
  }

  // Helper to safely join URL parts
  private buildUrl(endpoint: string, id?: number): string {
    // Remove any trailing or leading slashes from the endpoint to clean it up
    const cleanEndpoint = endpoint.replace(/^\/|\/$/g, '');

    if (id) {
      return `${this.baseUrl}${cleanEndpoint}/${id}/`;
    }
    return `${this.baseUrl}${cleanEndpoint}/`;
  }

  getAll(endpoint: string): Observable<any> {
    return this.http.get(this.buildUrl(endpoint)).pipe(catchError(this.handleError.bind(this)));
  }

  create(endpoint: string, data: any): Observable<any> {
    return this.http.post(this.buildUrl(endpoint), data).pipe(catchError(this.handleError.bind(this)));
  }

  update(endpoint: string, id: number, data: any): Observable<any> {
    return this.http.put(this.buildUrl(endpoint, id), data).pipe(catchError(this.handleError.bind(this)));
  }

  delete(endpoint: string, id: number): Observable<any> {
    return this.http.delete(this.buildUrl(endpoint, id)).pipe(catchError(this.handleError.bind(this)));
  }
}