import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; 
import { usersInterface } from '../models/users';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  url_api = 'http://localhost:3000/users';

  usersArray: usersInterface[] = [];
  toolsOfUser: any[] = [];

  constructor(private http: HttpClient) {}


  getusers(): Observable<usersInterface[]> {
    return this.http.get<usersInterface[]>(this.url_api);
  }

  getuserById(cedula: string): Observable<usersInterface> {
    return this.http.get<usersInterface>(`${this.url_api}/${cedula}`);
  }

  fetchUsers(): any[] {
    this.getusers().subscribe(
      (users) => {
        this.usersArray = users;
        console.log('usuarios cargados:', this.usersArray);
        return this.usersArray;
      },
      (err) => console.error('Error al cargar:', err)
    );
    return this.usersArray;
  }

  // --- Nuevos métodos para interactuar con la API (CRUD) ---

  createUsers(formData: FormData): Observable<usersInterface> {
    
    return this.http.post<usersInterface>(this.url_api, formData).pipe(
      
      tap((newUser) => {
        console.log('usuario creado en el backend:', newUser);
      
        this.fetchUsers();
      })
    );
  }

  // Método para actualizar una herramienta existente
  // Espera el ID de la herramienta y un objeto FormData con los datos actualizados

  updateUsers(id: string, data: any): Observable<usersInterface> {
   
    return this.http.put<usersInterface>(`${this.url_api}/${id}`, data).pipe(
      
      tap((updatedUser) => {
        console.log('Herramienta actualizada en el backend:', updatedUser);
       
        const index = this.usersArray.findIndex( user => user.cedula === updatedUser.cedula);
        if (index !== -1) {
          this.usersArray[index] = updatedUser;
        }
      })
    );
  }

  deleteUsers(id: string): Observable<any> {
    // La solicitud DELETE se envía a la URL específica de la herramienta
    return this.http.delete<any>(`${this.url_api}/${id}`).pipe(
       // Opcional: usar tap para refrescar la lista local después de una eliminación exitosa
      tap(() => {
        console.log(`Herramienta con ID ${id} eliminada en el backend`);
        // Elimina la herramienta del array local
        this.usersArray = this.usersArray.filter(users => users.cedula !== id);
        this.fetchUsers();
      })
    );
  }

  // --- Métodos existentes (revisados) ---

 
  getToolByIdLocal(cedula: string): usersInterface | undefined {
    // Renombrado para aclarar que es una búsqueda local
    console.log(`Buscando herramienta con ID ${cedula} en cache local.`);
    return this.usersArray.find(user => user.cedula === cedula);
  }

getToolsByCedula(cedula: string) {
  return this.http.get<any[]>(`http://localhost:3000/users/listTool/${cedula}`);
}

}