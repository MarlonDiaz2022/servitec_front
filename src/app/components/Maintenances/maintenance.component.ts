import { Component, OnInit } from '@angular/core';
import { maintenancesService } from '../../Services/maintenaces.service';
import { ToolService } from '../../Services/tool.service';
import { maintenanceInterface } from '../../models/maintenance';
import { toolInterface } from '../../models/tools';
import { CommonModule } from '@angular/common'; // A menudo necesario para *ngFor en standalone
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]

@Component({
  selector: 'app-maintenance', // Asegúrate de que este sea el selector correcto
  standalone: true, // <-- Verifica que sea true
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance.component.html', // <-- Este es el HTML que me mostraste
})
export class MaintenanceComponent implements OnInit {
  tools: toolInterface[] = [];
  viewMode: 'create' | 'list' | 'edit' = 'list';
  showEditForm: boolean = false;
  selectedToolId: string = '';
  comment: string = '';
  editmant: boolean = false;
  mantForm: any = {};
  mantid: string | null = null;

  maintenances: maintenanceInterface[] = [];
  selectedTool: toolInterface | null = null;
  selectedMaintenance: any;
  constructor(
    private maintenanceService: maintenancesService,
    private toolService: ToolService,
  ) {}

  ngOnInit(): void {
    this.fetchTools();
    this.fetchMaintenances();
  }

  fetchTools(): void {
    this.toolService.gettools().subscribe({
      next: (tools) => (this.tools = tools),
      error: (err) => console.error('Error al obtener herramientas', err),
    });
  }

  fetchMaintenances(): void {
    this.maintenanceService.getmaintenances().subscribe({
      next: (mants: maintenanceInterface[]) => {
        // Tipamos la respuesta
        this.maintenances = mants; // <--- ¡Asigna directamente los mantenimientos populados!
      },
      error: (err) => console.error('Error al obtener mantenimientos', err),
    });
  }

  createMaintenance(): void {
    if (!this.selectedToolId || !this.comment.trim()) {
      alert('Por favor selecciona una herramienta y escribe un comentario.');
      return;
    }

    const maintenanceData = {
      toolID: this.selectedToolId,
      comment: this.comment,
    };

    console.log('Datos a enviar:', maintenanceData);
    this.maintenanceService.createmaintenance(maintenanceData).subscribe({
      next: (res) => {
        console.log('Mantenimiento creado:', res);
        this.comment = '';
        this.selectedToolId = '';
        this.fetchMaintenances(); // Refresca la lista
      },
      error: (err) => console.error('Error al crear mantenimiento', err),
    });
  }

  detailstool(tool: toolInterface): void {
    // Recibe un parámetro de tipo toolInterface
    this.selectedTool = tool;
    console.log('Detalles de herramienta:', tool);
  }
  editMain(mant: any): void {
    console.log('editar', mant);
    this.selectedMaintenance = mant;
    this.mantForm = {
      comment: mant.comment,
    };
    this.mantid = mant._id;
    this.viewMode = 'edit';
  }

  saveMant(): void {
    
    if (!this.mantid) return;

    const updatePayload = {
      comment: this.mantForm.comment,
    };

    this.maintenanceService
      .updatemaintenance(this.mantid, updatePayload)
      .subscribe({
        next: (res) => {
          alert('Comentario actualizado exitosamente');
          this.editmant = false;
          this.mantid = null;
          this.mantForm = {};
          this.fetchMaintenances();
        },
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message));
        },
      });
  }

  // Cancelar edición
  cancelEdit(): void {
    this.editmant = false;
    this.mantForm = {};
    this.mantid = null;
    this.viewMode = 'list';
  }
}
