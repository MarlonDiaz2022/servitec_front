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

  constructor(public toolservice: ToolService) {}

  ngOnInit(): void {
    this.toolservice.fetchtools();
  }

  // ... (otros métodos como details, goMaintenance, deleteTool) ...

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
    this.toolForm = { id: tool.id || tool._id, ...tool };
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
      // No añadimos 'imageUrl' del objeto toolForm aquí porque el archivo se maneja aparte
      // A menos que estemos editando y NO se seleccione un nuevo archivo, en cuyo caso
      // el backend necesita saber la URL existente. La forma de manejar esto depende del backend.
      // Una opción común es enviar la 'imageUrl' existente si no hay 'selectedFile'.
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
      // Si estamos editando y no se subió un nuevo archivo, pero la herramienta ya tiene una imagen,
      // podrías enviar la URL existente para que el backend sepa que no debe eliminarla.
      // Esto depende de cómo tu backend maneje las actualizaciones de imagen sin nuevo archivo.
      // Si el backend simplemente ignora el campo de archivo si no está presente, esta parte no es necesaria.
      // Si necesitas enviar la URL existente, descomenta la siguiente línea:
      // formData.append('imageUrl', this.toolForm.imageUrl); // Asegúrate que tu backend lo espere así
      console.log(
        'No se seleccionó nuevo archivo, usando URL existente (si aplica)',
      );
    } else if (this.editingTool && !this.toolForm.imageUrl) {
      // Si estamos editando y la herramienta no tenía imagen y no se subió una nueva,
      // quizás necesites enviar algo para indicar que no hay imagen (ej: un string vacío o null)
      // dependiendo de cómo tu backend maneje este caso. O simplemente no envíes el campo 'imageUrl'.
      console.log('No se seleccionó nuevo archivo, y no había URL existente.');
    } else {
      // Creando y no se seleccionó archivo
      // Si crear herramienta sin imagen es válido, no añadas el campo 'imageUrl' a FormData.
      console.log('Creando sin archivo de imagen.');
    }

    let saveOperation;
    if (this.editingTool) {
      // Asegúrate de que tu API soporta PUT/PATCH a /tools/:id con FormData
      saveOperation = this.toolservice.updateTool(this.toolForm.id, formData);
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
        this.toolservice.fetchtools(); // Refresca la lista
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

  goMaintenance(id: string): void {
    this.toolservice.deleteTool(id).subscribe(
      (response) => {
        console.log('Herramienta eliminada', response);
        this.toolservice.fetchtools();
        this.selectedTool = null;
        this.showForm = false;
      },
      (error) => {
        console.error('Error al eliminar herramienta', error);
        alert(
          'Error al eliminar herramienta: ' +
            (error.error?.message || error.message),
        );
      },
    );
  }
}
