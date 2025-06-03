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
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class adminProfile implements OnInit {

  workerData!: usersInterface; // Datos del trabajador
  assignedTools: assignmentInterface[] = []; // Herramientas asignadas

  // Puedes obtener el ID del usuario del localStorage o de un servicio de autenticación
  workerCedula: string = ''; // Ajusta según cómo tengas autenticación

  constructor(
) {}

  ngOnInit(): void {}
 

  backTologin(): void {
    window.location.href = '/login'; 
  }


}