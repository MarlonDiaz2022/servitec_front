import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importamos tap para operaciones secundarias como refrescar la lista
import { toolInterface } from '../models/tools';

@Injectable({
  providedIn: 'root'
})

export class ToolService {

  url_api = 'http://localhost:3000/tools';

  toolArray: toolInterface[] = [];

  constructor(private http: HttpClient) {}

  // Método para obtener todas las herramientas de la API

  gettools(): Observable<toolInterface[]> {
    return this.http.get<toolInterface[]>(this.url_api);
  }
 
  fetchtools(): any[] {
    this.gettools().subscribe(
      (tools) => {
        this.toolArray = tools;
        console.log('Herramientas cargadas:', this.toolArray);
        return this.toolArray;
      },
      (err) => console.error('Error al cargar herramientas:', err)
    );
    return this.toolArray;
  }

  // --- Nuevos métodos para interactuar con la API (CRUD) ---

  createTool(formData: FormData): Observable<toolInterface> {
    
    return this.http.post<toolInterface>(this.url_api, formData).pipe(
      
      tap((newTool) => {
        console.log('Herramienta creada en el backend:', newTool);
      
        this.fetchtools();
      })
    );
  }

  // Método para actualizar una herramienta existente
  // Espera el ID de la herramienta y un objeto FormData con los datos actualizados

  updateTool(id: string, formData: FormData): Observable<toolInterface> {
   
    return this.http.put<toolInterface>(`${this.url_api}/${id}`, formData).pipe(
      
      tap((updatedTool) => {
        console.log('Herramienta actualizada en el backend:', updatedTool);
       
        const index = this.toolArray.findIndex(tool => tool.id === updatedTool.id);
        if (index !== -1) {
          this.toolArray[index] = updatedTool;
        }
        // O, más seguro para consistencia, refrescar toda la lista:
        // this.fetchtools();
      })
    );
  }

  // Método para eliminar una herramienta
  deleteTool(id: string): Observable<any> {
    // La solicitud DELETE se envía a la URL específica de la herramienta
    return this.http.delete<any>(`${this.url_api}/${id}`).pipe(
       // Opcional: usar tap para refrescar la lista local después de una eliminación exitosa
      tap(() => {
        console.log(`Herramienta con ID ${id} eliminada en el backend`);
        // Elimina la herramienta del array local
        this.toolArray = this.toolArray.filter(tool => tool.id !== id);
        // O, más seguro para consistencia, refrescar toda la lista:
        // this.fetchtools();
      })
    );
  }

  // --- Métodos existentes (revisados) ---

  // Este método busca una herramienta DENTRO del array local 'arreglotool'
  // No hace una llamada a la API. Es útil si ya tienes la lista cargada.
  // Nota: Si la lista local no está actualizada, este método puede fallar.
  getToolByIdLocal(id: string): toolInterface | undefined {
    // Renombrado para aclarar que es una búsqueda local
    console.log(`Buscando herramienta con ID ${id} en cache local.`);
    return this.toolArray.find(tool => tool.id === id);
  }

  // El método edittoolByid era redundante con getToolByIdLocal. Lo eliminamos.
  // La lógica de "editar" ahora está en el componente (cargando datos al formulario).


  // El método deleteTool existente también buscaba solo localmente. Ha sido reemplazado
  // por el nuevo método deleteTool que interactúa con la API.
}
