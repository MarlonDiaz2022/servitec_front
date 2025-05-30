import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importamos tap para operaciones secundarias como refrescar la lista
import { maintenanceInterface } from '../models/maintenance';

@Injectable({
  providedIn: 'root',
})
export class maintenancesService {
  url_api = 'http://localhost:3000/maintenances';

  maintenancesArray: maintenanceInterface[] = [];

  constructor(private http: HttpClient) {}

  // Método para obtener todas las herramientas de la API

  fetchmaintenances(): Observable<maintenanceInterface[]> {
    return this.http.get<maintenanceInterface[]>(this.url_api);
  }

  // Método para cargar las herramientas de la API y almacenarlas en arreglotool

  fetchtools(): void {
    this.fetchmaintenances().subscribe(
      (maintenances) => {
        this.maintenancesArray = maintenances;
      },
      (err) => console.error('Error al cargar herramientas:', err),
    );
  }

  // --- Nuevos métodos para interactuar con la API (CRUD) ---

  // Método para crear una nueva herramienta
  // Espera un objeto FormData, que es necesario para enviar archivos (como la imagen)

  createmaintenance(maintenance: {
    toolID: string;
    comment: string;
  }): Observable<maintenanceInterface> {
    return this.http.post<maintenanceInterface>(this.url_api, maintenance);
  }

  // Método para actualizar una herramienta existente
  // Espera el ID de la herramienta y un objeto FormData con los datos actualizados

  updatemaintenance(id: string, data: any): Observable<maintenanceInterface> {
    return this.http.put<maintenanceInterface>(`${this.url_api}/${id}`, data);
  }

  changeStatus(id: string): Observable<maintenanceInterface> {
  return this.http.put<maintenanceInterface>(`${this.url_api}/change/${id}`, {});
}

  // Método para eliminar una herramienta
  deletemaintenance(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url_api}/${id}`).pipe(
      tap(() => {
        console.log(`Herramienta con ID ${id} eliminada en el backend`);

        this.maintenancesArray = this.maintenancesArray.filter(
          (maintenance) => maintenance.toolID._id !== id,
        );
      }),
    );
  }

  getById(id: string): maintenanceInterface | undefined {
    console.log(`Buscando herramienta con ID ${id} en cache local.`);
    return this.maintenancesArray.find(
      (maintenance) => maintenance.toolID._id === id,
    );
  }
}
