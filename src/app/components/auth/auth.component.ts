import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class LoginComponent {
  cedula: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    this.authService.login(this.cedula, this.password).subscribe({
  next: (res) => {
    const role = res.user?._doc.role;
    localStorage.setItem('userRole', role);
    this.authService.etUserRole(role);
    alert('Inicio de sesión exitoso');

        if (this.cedula) {
          localStorage.setItem('workerCedula', this.cedula);
        } else {
          alert('No se encontró la cédula');
        }

        if (role === 'ADMIN') {
          this.router.navigate(['/adminprofile']);
        } else if (role === 'WORKER') {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al iniciar sesión: ' + (err.error.message || 'Error desconocido'));
      },
    });
  }

  
}
