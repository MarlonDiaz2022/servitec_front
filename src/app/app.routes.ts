import { Routes } from '@angular/router';
import { ToolComponent } from './components/tools/tool.component';
import { MaintenanceComponent } from './components/Maintenances/maintenance.component';
import { UsersComponent } from './components/users/users.component';
import { assignmentComponent } from './components/assignment/assignment.component';
import { LoginComponent } from './components/auth/auth.component';
import { WorkerProfile } from './components/user-home/userhome.component';

export const routes: Routes = [
  { path: 'tools', component: ToolComponent },
  { path: 'maintenances', component: MaintenanceComponent },
  { path: 'assignments', component: assignmentComponent},
  { path: 'users', component: UsersComponent},
  { path: 'login', component: LoginComponent }, // ruta para el login
  { path: 'profile', component: WorkerProfile }, // ruta para el perfil del trabajador
  { path: '', redirectTo: '/', pathMatch: 'full' } // ruta por defecto
];