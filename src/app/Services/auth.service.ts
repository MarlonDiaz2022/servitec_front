import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userRoleSubject = new BehaviorSubject<string | null>(localStorage.getItem('userRole'));
  userRole$ = this.userRoleSubject.asObservable();
  
  public currentUser: any = null;
  
  private apiUrl = 'http://localhost:3000/auth/login'; // Ajusta la URL si tu backend usa otro puerto

  constructor(private http: HttpClient, private router: Router) {}

  login(cedula: string, password: string): Observable<any> {
    const body = { cedula, password };
    return this.http.post(this.apiUrl, body);
  }

etUserRole(role: string | null) {
    this.userRoleSubject.next(role);
  }

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('workerCedula');
    this.etUserRole(null);
    this.router.navigate(['/login']);
  }
}