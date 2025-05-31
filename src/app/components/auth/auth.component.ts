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
        console.log(res);
        alert('Login exitoso');

        const role = res.user?._doc.role;

        const cedula = res.user?._doc.cedula;

        if (cedula) {
          localStorage.setItem('workerCedula', cedula);
        } else {
          alert('No se encontró la cédula');
        }

        if (role === 'ADMIN') {
          this.router.navigate(['/tools']);
        } else if (role === 'WORKER') {
          this.router.navigate(['/profile']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error.message || 'Error desconocido';
      },
    });
  }
}
