import { Routes } from '@angular/router';
import { ToolComponent } from './components/tools/tool.component';
import { MaintenanceComponent } from './components/Maintenances/maintenance.component';
import { assignmentComponent } from './components/assignment/assignment.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
  { path: 'tools', component: ToolComponent },
  { path: 'maintenances', component: MaintenanceComponent },
  { path: 'assignments', component: assignmentComponent},
  {path: 'users', component: UsersComponent},
  { path: '', redirectTo: '/tools', pathMatch: 'full' } // ruta por defecto
];