import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../Services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-tool',
  imports: [CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  templateUrl: './users.component.html',
})

export class UsersComponent implements OnInit {

  showForm: boolean = false;
  editinguser: boolean = false;
  userForm: any = {};
  selecteduser: any = null;

  constructor(public usersService: UsersService) {}

  ngOnInit(): void {
      this.usersService.fetchUsers();
  }

  // ... (otros métodos como details, goMaintenance, deleteTool) ...

  detailstool(user: any){
    console.log('detailstool llamado con herramienta:', user)
    this.selecteduser = user;
  }
  

  // Inicia el proceso para añadir una nueva herramienta
  addNewTool(): void {
    this.editinguser = false;
    this.userForm = {
      name: '',
      cedula: '',
      phone: '',
      password: '',
    };
    this.showForm = true;
    this.selecteduser = null;
  }

  // Inicia el proceso para editar una herramienta existente
  editUser(tool: any): void {
    this.editinguser = true;
    this.userForm= { id: tool.id || tool._id, ...tool };
    this.showForm = true;
    this.selecteduser = null;
  }

  // Cancela la operación del formulario
  cancelForm(): void {
    this.showForm = false;
    this.userForm = {};
  }

  // Guarda los datos del formulario
  saveuser(): void {
    console.log('Datos del formulario a enviar:', this.userForm);

    const formData = new FormData();

    for (const key in this.userForm) {
        // No añadimos 'imageUrl' del objeto toolForm aquí porque el archivo se maneja aparte
        // A menos que estemos editando y NO se seleccione un nuevo archivo, en cuyo caso
        // el backend necesita saber la URL existente. La forma de manejar esto depende del backend.
        // Una opción común es enviar la 'imageUrl' existente si no hay 'selectedFile'.
        if (this.userForm.hasOwnProperty(key)) {
             if (key === 'operating' || key === 'maintenance') {
                 formData.append(key, this.userForm[key] ? 'true' : 'false');
             } else {
                 formData.append(key, this.userForm[key]);
             }
        }
    }
 
    let saveOperation;
    if (this.editinguser) {
      // Asegúrate de que tu API soporta PUT/PATCH a /tools/:id con FormData
      saveOperation = this.usersService.updateUsers(this.userForm.cedula, formData);
    } else {
      // Asegúrate de que tu API soporta POST a /tools con FormData
      saveOperation = this.usersService.createUsers(formData);
    }

    saveOperation.subscribe(
      (response: any) => {
        console.log('Herramienta guardada con éxito', response);
        this.showForm = false;
        this.userForm = {};
        this.usersService.fetchUsers(); // Refresca la lista
      },
      (error: any) => {
        console.error('Error al guardar herramienta', error);
        // Puedes mostrar un mensaje de error al usuario aquí
        alert('Error al guardar herramienta: ' + (error.error?.message || error.message));
      }
    );
  }

  golist(){
    
  }

}