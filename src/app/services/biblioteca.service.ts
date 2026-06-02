import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Biblioteca } from '../models/biblioteca.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BibliotecaService {
  private url = `${environment.apiUrl}/bibliotecas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Biblioteca[]> {
    return this.http.get<Biblioteca[]>(this.url);
  }

  getById(id: number): Observable<Biblioteca> {
    return this.http.get<Biblioteca>(`${this.url}/${id}`);
  }

  create(biblioteca: Biblioteca): Observable<Biblioteca> {
    return this.http.post<Biblioteca>(this.url, biblioteca);
  }

  update(id: number, biblioteca: Biblioteca): Observable<Biblioteca> {
    return this.http.put<Biblioteca>(`${this.url}/${id}`, biblioteca);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
