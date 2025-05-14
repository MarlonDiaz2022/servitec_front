import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importamos tap para operaciones secundarias como refrescar la lista
import { usersInterface } from '../models/users';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  url_api = 'http://localhost:3000/users';

  usersArray: usersInterface[] = [];

  constructor(private http: HttpClient) {}


  gettools(): Observable<usersInterface[]> {
    return this.http.get<usersInterface[]>(this.url_api);
  }

  // Método para cargar las herramientas de la API y almacenarlas en arreglotool
 
  fetchUsers(): void {
    this.gettools().subscribe(
      (tools) => {
        this.usersArray = tools;
        console.log('usuarios cargados:', this.usersArray);
      },
      (err) => console.error('Error al cargar:', err)
    );
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

  updateUsers(id: string, formData: FormData): Observable<usersInterface> {
   
    return this.http.put<usersInterface>(`${this.url_api}/${id}`, formData).pipe(
      
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
        
      })
    );
  }

  // --- Métodos existentes (revisados) ---

 
  getToolByIdLocal(cedula: string): usersInterface | undefined {
    // Renombrado para aclarar que es una búsqueda local
    console.log(`Buscando herramienta con ID ${cedula} en cache local.`);
    return this.usersArray.find(user => user.cedula === cedula);
  }

}