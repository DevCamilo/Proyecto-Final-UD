import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  constructor(private http: HttpClient) { }
  getArchivo(){
    return this.http.get('', { responseType: 'text' });
  }
}
