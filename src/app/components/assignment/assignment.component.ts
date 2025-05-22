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

  filterWorkers() {
    const search = this.searchWorker.toLowerCase();
    this.filteredWorkers = this.workers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(search) ||
        worker.cedula.toString().includes(search),
    );
  }

  filterTools() {
    const search = this.searchTool.toLowerCase();
    this.filteredTools = this.tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(search) ||
        tool.code.toLowerCase().includes(search) ||
        tool.serial?.toLowerCase().includes(search),
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

  createAsign(): void {

    const tool: toolInterface = {_id: this.searchTool};

    debugger;
    let finalWorker: usersInterface | null = this.selectedWorker ? this.selectedWorker : this.searchWorker // Asume que el usuario seleccionó del dropdown
    let finalTool: toolInterface | null = this.selectedTool ? this.selectedTool : tool; // Asume que el usuario seleccionó del dropdown



    console.log('selectedWorker:', finalTool, finalWorker);

    if (!finalWorker || !finalTool) {
      alert(
        'Debes ingresar o seleccionar un trabajador y una herramienta válidos.',
      );
      return;
    }

    const payload = {
      workerId: finalWorker,
      toolId: finalTool._id,
      place: this.asignForm.place,
      date_of_loan: this.asignForm.date_of_loan,
      delivery_date: this.asignForm.delivery_date,
      status: this.asignForm.status,
    };
debugger;

    this.asignservice.createasign(payload).subscribe({
      next: (res) => {
        alert('Asignación creada con éxito');
        this.asignservice.fetchAsign();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al crear asignación:', err);
        console.log('info', payload);
        alert('Error al crear la asignación. Revisa la consola.');
      },
    });
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
  }

  editAsign(user: any): void {
    this.editingAsing = true;
    this.asignForm = {
      _id: user._id,
      name: user.name,
      cedula: user.cedula,
      phone: user.phone,
    };

    this.showForm = true;
    this.selectedAsign = null;
  }

  // Cancela la operación del formulario
  cancelForm(): void {
    this.showForm = false;
    this.asignForm = {};
  }

  saveAsign(): void {
    console.log('Datos del formulario a enviar:', this.asignForm);

    const formData = new FormData();

    for (const key in this.asignForm) {
      if (this.asignForm.hasOwnProperty(key)) {
        if (key === 'operating' || key === 'maintenance') {
          formData.append(key, this.asignForm[key] ? 'true' : 'false');
        } else {
          formData.append(key, this.asignForm[key]);
        }
      }
    }

    let saveOperation;
    if (this.editingAsing) {
      if (this.editingAsing) {
        saveOperation = this.asignservice.updateasign(
          this.asignForm._id,
          this.asignForm,
        ); // usa _id aquí
      } else {
        saveOperation = this.asignservice.createasign(this.asignForm);
      }
    } else {
      saveOperation = this.asignservice.createasign(this.asignForm);
    }

    saveOperation.subscribe(
      (response: any) => {
        console.log('Herramienta guardada con éxito', response);
        this.showForm = false;
        this.asignForm = {};
        this.asignservice.fetchAsign();
      },
      (error: any) => {
        console.error('Error al guardar herramienta', error);
        // Puedes mostrar un mensaje de error al usuario aquí
        alert('Error al guardar : ' + (error.error?.message || error.message));
      },
    );
  }
}
