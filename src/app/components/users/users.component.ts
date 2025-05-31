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
  toolsOfUser: any[] = [];
  modalTool: any = null;


  filterName: string = '';
  filtercedula: string = '';
  filteredUsers: any[] = [];

  constructor(public usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.fetchUsers();
  }


  detailstool(user: any) {
    console.log('detailstool llamado con herramienta:', user);
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
  editUser(user: any): void {
    this.editinguser = true;
    this.userForm = {
      _id: user._id,
      name: user.name,
      cedula: user.cedula,
      phone: user.phone,
    };

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
      if (this.editinguser) {
        saveOperation = this.usersService.updateUsers(
          this.userForm._id,
          this.userForm,
        ); // usa _id aquí
      } else {
        saveOperation = this.usersService.createUsers(this.userForm);
      }
    } else {
      saveOperation = this.usersService.createUsers(this.userForm);
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
        alert('Error al guardar : ' + (error.error?.message || error.message));
      },
    );
  }

  golist(user: any): void {
    const cedula = user.cedula;
    this.usersService.getToolsByCedula(cedula).subscribe({
      next: (tools: any[]) => {
        console.log('Herramientas del usuario:', tools);
        this.toolsOfUser = tools; // <--- Aquí se guarda la lista
        this.selecteduser = user;
      },
      error: (err) => {
        console.error('Error al obtener herramientas:', err);
        alert(
          'No se pudieron obtener las herramientas: ' +
            (err.error?.message || err.message),
        );
      },
    });
  }
  openModal(user: any): void {
    this.selecteduser = user;
    this.golist(user); // carga herramientas

    setTimeout(() => {
      const modalEl = document.getElementById('modalAssignedTool');
      if (modalEl) {
        const modal = new (window as any).bootstrap.Modal(modalEl);
        modal.show();
      } else {
        console.error('Modal no encontrado');
      }
    }, 200); // Espera más tiempo si necesitas asegurar el render
  }

  applyFilters(): void {
    this.filteredUsers = this.usersService.usersArray.filter(users => {
      const nameMatch = !this.filterName || 
        users.name.toLowerCase().includes(this.filterName.toLowerCase());
      const cedulaMatch = !this.filtercedula || 
        users.cedula?.toLowerCase().includes(this.filtercedula.toLowerCase());
    
      
      return nameMatch && cedulaMatch;
    });
  }

  // Método para resetear los filtros
  resetFilters(): void {
    this.filterName = '';
    this.filtercedula = '';
    this.applyFilters();
  }


}