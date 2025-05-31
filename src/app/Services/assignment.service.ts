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
  this.http.get<assignmentInterface[]>(this.url_api).subscribe((data) => {
    this.assignmentArray = data.sort((a, b) =>
      new Date(b.date_of_loan).getTime() - new Date(a.date_of_loan).getTime()
    );
  });
}
  

 createasign(data: any): Observable<any> {
  return this.http.post(`${this.url_api}`, data);
}

 
 updateasign(id: string, data: any): Observable<assignmentInterface> {
  return this.http.put<assignmentInterface>(`${this.url_api}/${id}`, data);
}

 changeStatus(id: string): Observable<assignmentInterface> {
  return this.http.put<assignmentInterface>(`${this.url_api}/change/${id}`,{}).pipe() 
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