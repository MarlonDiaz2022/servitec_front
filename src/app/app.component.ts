import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router'; // Importar NavigationEnd
import { AuthService } from './Services/auth.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  role: string | null = null;
  isNavbarCollapsed: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.userRole$.subscribe((role) => {
      this.role = role;
      console.log('User role updated:', this.role);
    });
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  logout(): void {
    this.authService.logout();
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
