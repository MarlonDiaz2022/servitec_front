import { Component, OnInit } from '@angular/core';
import { ToolService } from '../../Services/tool.service';
import { maintenanceInterface } from '../../models/maintenance';
import { toolInterface } from '../../models/tools';
import { CommonModule } from '@angular/common'; // A menudo necesario para *ngFor en standalone
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]

@Component({
  selector: 'app-maintenance', // Asegúrate de que este sea el selector correcto
  standalone: true,             // <-- Verifica que sea true
  imports: [
    CommonModule,
    FormsModule],
  templateUrl: './assignment.component.html', // <-- Este es el HTML que me mostraste
})

export class assignmentComponent implements OnInit {


     maintenances: maintenanceInterface[] = [];
      selectedTool: toolInterface | null = null;
      constructor(
       
      ) {}
    
      ngOnInit(): void {
        
      }
    
}