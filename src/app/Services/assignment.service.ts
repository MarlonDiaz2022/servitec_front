import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importamos tap para operaciones secundarias como refrescar la lista
import { assignmentInterface } from '../models/assignment';


@Injectable({
  providedIn: 'root'
})
export class assignmentService {

  url_api = 'http://localhost:3000/assignments';

  
 assignmentArray: assignmentInterface[] = [];

  constructor(private http: HttpClient) {}

  // Método para obtener todas las herramientas de la API

  getmaintenances(): Observable<assignmentInterface[]> {
    return this.http.get<assignmentInterface[]>(this.url_api);
  }

  // Método para cargar las herramientas de la API y almacenarlas en arreglotool
  
  fetchAsign(): void {
    this.getmaintenances().subscribe(
      (maintenances) => {
        this.assignmentArray = maintenances;
        console.log("asignaciones cargadas", maintenances)
      },
      (err) => console.error('Error al cargar herramientas:', err)
    );
  }
  

  // --- Nuevos métodos para interactuar con la API (CRUD) ---

  // Método para crear una nueva herramienta
  // Espera un objeto FormData, que es necesario para enviar archivos (como la imagen)

 createasign(data: any): Observable<any> {
  return this.http.post(`${this.url_api}`, data);
}

  // Método para actualizar una herramienta existente
  // Espera el ID de la herramienta y un objeto FormData con los datos actualizados

 updateasign(id: string, data: any): Observable<assignmentInterface> {
  return this.http.put<assignmentInterface>(`${this.url_api}/${id}`, data);
}

  // Método para eliminar una herramienta
  deletemaasign(id: string): Observable<any> {
   
    return this.http.delete<any>(`${this.url_api}/${id}`).pipe(

      tap(() => {
        console.log(`Herramienta con ID ${id} eliminada en el backend`);
      
       this.assignmentArray = this.assignmentArray.filter(maintenance => maintenance.tool._id !== id);
        
      })
    );
  }

  
  getById(id: string): assignmentInterface | undefined {
    console.log(`Buscando herramienta con ID ${id} en cache local.`);
    return this.assignmentArray.find(maintenance => maintenance.tool._id === id);
  }
}