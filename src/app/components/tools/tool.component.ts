import { Component, OnInit } from '@angular/core';
import { ToolService } from '../../Services/tool.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tool',
  imports: [CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.css',
})
export class ToolComponent implements OnInit {
  showForm: boolean = false;
  editingTool: boolean = false;
  toolForm: any = {};
  selectedFile: File | null = null;

  selectedTool: any = null;

  filterName: string = '';
  filterModel: string = '';
  filterCode: string = '';
  filterAmount: number | null = null;
  filterEstado: string = '';
  filteredTools: any[] = [];

  constructor(public toolservice: ToolService) {}

  ngOnInit(): void {
    this.toolservice.fetchtools();
  }

  // ... (otros métodos como details, goMaintenance, deleteTool) ...

volverAtras() {
    this.showForm = false;
  }

  detailstool(tool: any) {
    console.log('detailstool llamado con herramienta:', tool);
    this.selectedTool = tool;
  }

  // Inicia el proceso para añadir una nueva herramienta
  addNewTool(): void {
    this.editingTool = false;
    this.toolForm = {
      id: '',
      name: '',
      model: '',
      code: '',
      serial: '',
      amount: 0,
      imageUrl: '',
      operating: true,
      maintenance: false,
    };
    this.selectedFile = null;
    this.showForm = true;
    this.selectedTool = null;
  }

  // Inicia el proceso para editar una herramienta existente
  editTool(tool: any): void {
    this.editingTool = true;
    this.toolForm = { id: tool._id, ...tool };
    this.selectedFile = null;
    this.showForm = true;
    this.selectedTool = null;
  }

  // Cancela la operación del formulario
  cancelForm(): void {
    this.showForm = false;
    this.toolForm = {};
    this.selectedFile = null;
  }

  // Maneja la selección de un archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Archivo seleccionado:', this.selectedFile?.name);
    } else {
      this.selectedFile = null;
      console.log('Ningún archivo seleccionado');
    }
  }

  // Guarda los datos del formulario
  saveTool(): void {
    console.log('Datos del formulario a enviar:', this.toolForm);
    console.log('Archivo a subir:', this.selectedFile);

    const formData = new FormData();
    for (const key in this.toolForm) {
      if (this.toolForm.hasOwnProperty(key) && key !== 'imageUrl') {
        if (key === 'operating' || key === 'maintenance') {
          formData.append(key, this.toolForm[key] ? 'true' : 'false');
        } else {
          formData.append(key, this.toolForm[key]);
        }
      }
    }
    if (this.selectedFile) {
      formData.append('imageUrl', this.selectedFile, this.selectedFile.name);
      console.log("Adjuntando archivo con nombre de campo 'imageUrl'");
    } else if (this.editingTool && this.toolForm.imageUrl) {
      console.log(
        'No se seleccionó nuevo archivo, usando URL existente (si aplica)',
      );
    } else if (this.editingTool && !this.toolForm.imageUrl) {
      console.log('No se seleccionó nuevo archivo, y no había URL existente.');
    } else {
      console.log('Creando sin archivo de imagen.');
    }

    let saveOperation;
    if (this.editingTool) {
      saveOperation = this.toolservice.updateTool(this.toolForm.id, formData);
      console.log("Actualizando", this.toolForm.id, "con datos:", this.toolForm.name);
    } else {
      // Asegúrate de que tu API soporta POST a /tools con FormData
      saveOperation = this.toolservice.createTool(formData);
    }

    saveOperation.subscribe(
      (response: any) => {
        console.log('Herramienta guardada con éxito', response);
        this.showForm = false;
        this.toolForm = {};
        this.selectedFile = null;
        this.toolservice.fetchtools();
        this.applyFilters(); // Refresca la lista
      },
      (error: any) => {
        console.error('Error al guardar herramienta', error);
        // Puedes mostrar un mensaje de error al usuario aquí
        alert(
          'Error al guardar herramienta: ' +
            (error.error?.message || error.message),
        );
      },
    );
  }

  goMaintenance(tool : any): void {
    console.log('goMaintenance llamado con herramienta:', tool);
    this.selectedTool = tool;
     }

  applyFilters(): void {
    this.filteredTools = this.toolservice.toolArray.filter(tool => {
      const nameMatch = !this.filterName || 
        tool.name?.toLowerCase().includes(this.filterName.toLowerCase());
      const modelMatch = !this.filterModel || 
        tool.model?.toLowerCase().includes(this.filterModel.toLowerCase());
      const codeMatch = !this.filterCode || 
        (tool.code && tool.code.toLowerCase().includes(this.filterCode.toLowerCase()));
      const amountMatch = !this.filterAmount || 
        tool.amount === this.filterAmount;
      const estadoMatch = !this.filterEstado || 
        tool.operating === (this.filterEstado === 'true');

      return nameMatch && modelMatch && codeMatch && amountMatch && estadoMatch;
    });
  }

  // Método para resetear los filtros
  resetFilters(): void {
    this.filterName = '';
    this.filterModel = '';
    this.filterCode = '';
    this.filterAmount = null;
    this.filterEstado = '';
    this.applyFilters();
  }
}
