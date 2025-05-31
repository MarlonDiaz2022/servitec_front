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
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css', 
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

  searchTool: string = '';
  
  maintenances: maintenanceInterface[] = [];
  selectedTool: any = null;
  selectedMaintenance: any;
  constructor(
    private maintenanceService: maintenancesService,
    private toolService: ToolService,
  ) {}

  ngOnInit(): void {
    this.fetchTools();
    this.fetchMaintenances()}

  fetchTools(): void {
    this.toolService.gettools().subscribe({
      next: (tools) => (this.tools = tools),
      error: (err) => console.error('Error al obtener herramientas', err),
    });
  }

  fetchMaintenances(): void {
  this.maintenanceService.fetchmaintenances().subscribe({
    next: (mants: maintenanceInterface[]) => {
      console.log('Mantenimientos recibidos:', mants); 
      this.maintenances = mants.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },
    error: (err) => console.error('Error al obtener mantenimientos', err),
  });
}

  findTool(searchTerm: string): void {
    const cleanSearch = searchTerm.trim().toLowerCase();

    const foundTool = this.tools.find(
      (tool) =>
        tool.code?.toLowerCase().includes(cleanSearch) ||
        tool.name?.toLowerCase().includes(cleanSearch),
    );

    // Si encontramos una herramienta, actualizar el ID seleccionado
    if (foundTool) {
      this.selectedToolId = String(foundTool._id);
    } else {
      this.selectedToolId = '';
    }
  }

  createMaintenance(): void {
    // Buscar la herramienta seleccionada
    const selectedTool = this.tools.find(
      (tool) => tool._id === this.selectedToolId,
    );

    if (!selectedTool || !selectedTool._id) {
      alert('Debes seleccionar una herramienta válida');
      return;
    }

    const maintenanceData = {
      toolID: String(selectedTool._id), // Usamos el _id de la herramienta encontrada
      comment: this.comment,
    };

    this.maintenanceService.createmaintenance(maintenanceData).subscribe({
      next: (res) => {
        console.log('Mantenimiento creado:', res);
        this.comment = '';
        this.searchTool = '';
        this.selectedToolId = '';
        this.fetchMaintenances();
      },
      error: (err) => {
        console.error('Error al crear mantenimiento:', err);
        alert('Error: ' + (err.error?.message || 'Verifica la consola'));
      },
    });
  }

  detailstool(tool: toolInterface): void {
    // Recibe un parámetro de tipo toolInterface
    this.selectedTool = tool;
    console.log('Detalles de herramienta:', tool);
  }

  editMain(mant: maintenanceInterface): void {
    // Usa la interfaz correcta
    if (!mant?._id) {
      console.error('Mantenimiento no válido');
      return;
    }

    this.selectedMaintenance = mant;
    this.mantForm = { comment: mant.comment };
    this.mantid = String(mant._id); // Asegurar conversión a string
    this.viewMode = 'edit';
  }

  saveMant(): void {
    if (!this.mantid) {
      console.error('ID de mantenimiento no válido');
      return;
    }
    // Asegurar que el ID es string
    const maintenanceId = String(this.mantid);

    const updatePayload = {
      comment: this.mantForm.comment,
    };

    this.maintenanceService
      .updatemaintenance(maintenanceId, updatePayload)
      .subscribe({
        next: (res) => {
          alert('Comentario actualizado exitosamente');
          this.cancelEdit();
          this.fetchMaintenances();
        },
        error: (err) => {
          console.error('Error completo:', err); // Más detalles
          console.error('URL solicitada:', err.url); // Verificar la URL
          alert(
            `Error al actualizar: ${err.error?.message || 'Ver consola para detalles'}`,
          );
        },
      });
  }

  changemant(mantId: string): void {
    this.maintenanceService.changeStatus(mantId).subscribe({
      next: (res) => {
        alert('Estado de mantenimiento cambiado exitosamente');
        this.fetchMaintenances();
      },
      error: (err) => {
        console.error('Error al cambiar estado del mantenimiento:', err);
        // Mostrar un mensaje de error más específico si el backend lo envía
        const errorMessage = err.error?.message
          ? Array.isArray(err.error.message)
            ? err.error.message.join(', ')
            : err.error.message
          : 'Error desconocido. Verifica la consola.';
        alert('No se pudo cambiar el estado: ' + errorMessage);
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
