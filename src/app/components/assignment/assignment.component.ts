import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 importar CommonModule
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { assignmentService } from '../../Services/assignment.service';
import { ToolService } from '../../Services/tool.service';
import { UsersService } from '../../Services/users.service';
import { usersInterface } from '../../models/users';
import { toolInterface } from '../../models/tools';

@Component({
  selector: 'app-tool',
  imports: [CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.css',
})
export class assignmentComponent implements OnInit {
  showForm: boolean = false;
  editingAsing: boolean = false;
  asignForm: any = {};
  selectedFile: File | null = null;
  selectedAsign: any = null;
  workers: any[] = [];
  tools: any[] = [];
  filteredWorkers: any[] = [];
  filteredTools: any[] = [];

  editingAsign: boolean = false;

  searchWorker: string = '';
  searchTool: string = '';

  selectedWorker: any = null;
  selectedTool: any = null;

  constructor(
    public asignservice: assignmentService,
    private workerService: UsersService,
    private toolsService: ToolService,
  ) {}

  ngOnInit(): void {
    this.asignservice.fetchAsign();
    this.workerService.fetchUsers();
    this.toolsService.fetchtools();
  }

  findWorker(searchTerm: string): usersInterface | undefined {
    const cleanSearch = searchTerm.trim().toLowerCase();
    return this.workerService.usersArray.find(
      (worker) =>
        worker.cedula?.includes(cleanSearch) ||
        worker.name.toLowerCase().includes(cleanSearch),
    );
  }

  findTool(searchTerm: string): toolInterface | undefined {
    const cleanSearch = searchTerm.trim().toLowerCase();
    return this.toolsService.toolArray.find(
      (tool) =>
        tool.code?.toLowerCase().includes(cleanSearch) ||
        tool.serial?.toLowerCase().includes(cleanSearch) ||
        tool.name?.toLowerCase().includes(cleanSearch),
    );
  }

  detailstool(tool: any) {
    console.log('detailstool llamado con herramienta:', tool);
    this.selectedAsign = tool;
  }

  mostrarFormulario() {
    this.filteredTools = this.toolsService.fetchtools();
    this.filteredWorkers = this.workerService.fetchUsers();

    this.showForm = true;
    setTimeout(() => {
      const formEl = document.getElementById('formContainer');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }

  volverAtras() {
    this.showForm = false;
  }

 onSubmit(): void {
  const finalWorker = this.selectedWorker;
  const finalTool = this.selectedTool;

  if (!finalWorker || !finalTool) {
    alert('Debes seleccionar un trabajador y una herramienta válidos.');
    return;
  }

  const payload = {
    workerId: finalWorker._id,
    toolId: finalTool._id,
    place: this.asignForm.place,
    date_of_loan: this.asignForm.date_of_loan,
    delivery_date: this.asignForm.delivery_date,
    status: this.asignForm.status,
  };

  if (this.editingAsign && this.selectedAsign && this.selectedAsign._id) {
    // Modo edición
    this.asignservice.updateasign(this.selectedAsign._id, payload).subscribe({
      next: () => {
        alert('Asignación actualizada con éxito');
        this.resetForm();
        this.asignservice.fetchAsign();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar la asignación');
      },
    });
  } else {
    // Modo creación
    this.asignservice.createasign(payload).subscribe({
      next: () => {
        alert('Asignación creada con éxito');
        this.resetForm();
        this.asignservice.fetchAsign();
      },
      error: (err) => {
        console.error('Error al crear asignación:', err);
        alert('Error al crear la asignación');
      },
    });
  }
}

editAsign(asign: any): void {
  this.editingAsign = true;
  this.showForm = true;
  this.selectedAsign = asign;

  // Rellenar formulario
  this.asignForm = {
    place: asign.place,
    date_of_loan: asign.date_of_loan?.substring(0, 10), 
    delivery_date: asign.delivery_date?.substring(0, 10),
    status: asign.status,
  };

  // Buscar worker y tool por ID
  this.selectedWorker = this.workerService.usersArray.find(w => w._id === asign.worker?._id || asign.worker);
  this.selectedTool = this.toolsService.toolArray.find(t => t._id === asign.tool?._id || asign.tool);

  // Filtrados por defecto
  this.filteredWorkers = this.workerService.usersArray;
  this.filteredTools = this.toolsService.toolArray;

  // Scroll al formulario
  setTimeout(() => {
    const formEl = document.getElementById('formContainer');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, 0);
}

  resetForm() {
    this.asignForm = {
      place: '',
      date_of_loan: '',
      delivery_date: '',
      status: 'Activa',
    };

    this.selectedWorker = null;
    this.selectedTool = null;
    this.searchWorker = '';
    this.searchTool = '';
    this.filteredWorkers = this.workers;
    this.filteredTools = this.tools;

    this.selectedAsign = null;
    this.showForm = false;
  }

  // Cancela la operación del formulario
  cancelForm(): void {
    this.showForm = false;
    this.asignForm = {};
  }

  changeStatus(asignId: string): void {
   this.asignservice.changeStatus(asignId).subscribe({
      next: (res) => {
        alert('Estado de mantenimiento cambiado exitosamente');
        this.asignservice.fetchAsign();
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

 
}
