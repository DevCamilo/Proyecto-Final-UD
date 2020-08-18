import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  constructor(private http: HttpClient) { }
  public getArchivo(): Observable<String>{ //Trae el archivo de la ubicación
    return this.http.get('./assets/robot.txt', { responseType: 'text' });
  }
}
