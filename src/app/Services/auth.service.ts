import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth/login'; // Ajusta la URL si tu backend usa otro puerto

  constructor(private http: HttpClient) {}

  login(cedula: string, password: string): Observable<any> {
    const body = { cedula, password };
    return this.http.post(this.apiUrl, body);
  }
}