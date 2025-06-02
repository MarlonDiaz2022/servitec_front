import { Routes } from '@angular/router';
import { ToolComponent } from './components/tools/tool.component';
import { MaintenanceComponent } from './components/Maintenances/maintenance.component';
import { UsersComponent } from './components/users/users.component';
import { assignmentComponent } from './components/assignment/assignment.component';
import { LoginComponent } from './components/auth/auth.component';
import { WorkerProfile } from './components/home/userhome.component';
import { adminProfile } from './components/home/adminhome.component';



export const routes: Routes = [
  { path: 'tools', component: ToolComponent },
  { path: 'maintenances', component: MaintenanceComponent }, // ruta para los mantenimientos
  { path: 'assignments', component: assignmentComponent}, // ruta para las asignaciones
  { path: 'users', component: UsersComponent}, // ruta para los usuarios
  { path: 'login', component: LoginComponent }, // ruta para el login
  { path: 'profile', component: WorkerProfile }, // ruta para el perfil del trabajador
  { path: 'adminprofile', component: adminProfile }, // ruta para el perfil del administrador
  { path: '', redirectTo: '/login', pathMatch: 'full' } // ruta por defecto
];