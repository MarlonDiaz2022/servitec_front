import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../Services/users.service';
import { assignmentService } from '../../Services/assignment.service';
import { usersInterface } from '../../models/users';
import { assignmentInterface } from '../../models/assignment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-worker-profile',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css']
})
export class WorkerProfile implements OnInit {

  workerData!: usersInterface; // Datos del trabajador
  assignedTools: assignmentInterface[] = []; // Herramientas asignadas

  // Puedes obtener el ID del usuario del localStorage o de un servicio de autenticación
  workerCedula: string = ''; // Ajusta según cómo tengas autenticación

  constructor(
    private usersService: UsersService,
    private assignmentService: assignmentService
  ) {}

  ngOnInit(): void {
  this.workerCedula = localStorage.getItem('workerCedula') || '';
  if (!this.workerCedula) {
    console.error('La cédula del trabajador no está disponible en el localStorage');
    return;
  }

  this.loadWorkerData();
  this.loadAssignedTools();
}

  loadWorkerData(): void {
    // Usa el array local o llama al backend
    this.usersService.getuserById(this.workerCedula).subscribe(
      (user: usersInterface | null) => {
        if (user) {
          this.workerData = user;
        } else {
          this.usersService.getusers().subscribe(users => {
            const found = users.find(u => u.cedula === this.workerCedula);
            if (found) {
              this.workerData = found;
            }
          });
        }
      }
    );
  }

  loadAssignedTools(): void {
    this.usersService.getToolsByCedula(this.workerCedula).subscribe(
      (tools: assignmentInterface[]) => {
        this.assignedTools = tools;
      },
      (err) => console.error('Error al cargar herramientas:', err)
    );
  }

  backTologin(): void {
    window.location.href = '/login'; 
  }


}