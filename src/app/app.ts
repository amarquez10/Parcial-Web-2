import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  readonly apiUrl = 'http://localhost:8080/api';

  // ── Vistas ──
  vista: 'bibliotecas' | 'libros' = 'bibliotecas';

  // ── Bibliotecas ──
  bibliotecas: any[] = [];
  showBibForm = false;
  editBib: any = null;
  bib = { nombre: '', direccion: '', telefono: '', responsable: '' };

  // ── Libros ──
  libros: any[] = [];
  showLibForm = false;
  editLib: any = null;
  lib = { titulo: '', autor: '', categoria: '', bibliotecaId: 0 };

  msg = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBibliotecas();
    this.loadLibros();
  }

  // ──── Bibliotecas CRUD ────
  loadBibliotecas() {
    this.http.get<any[]>(`${this.apiUrl}/bibliotecas`).subscribe({ next: d => this.bibliotecas = d, error: () => {} });
  }

  abrirCrearBib() {
    this.editBib = null;
    this.bib = { nombre: '', direccion: '', telefono: '', responsable: '' };
    this.showBibForm = true;
  }

  abrirEditBib(b: any) {
    this.editBib = b;
    this.bib = { ...b };
    this.showBibForm = true;
  }

  guardarBib() {
    const obs = this.editBib
      ? this.http.put(`${this.apiUrl}/bibliotecas/${this.editBib.id}`, this.bib)
      : this.http.post(`${this.apiUrl}/bibliotecas`, this.bib);
    obs.subscribe({ next: () => { this.showBibForm = false; this.loadBibliotecas(); this.setMsg(this.editBib ? 'Biblioteca actualizada.' : 'Biblioteca creada.'); }, error: () => this.setMsg('Error al guardar.') });
  }

  eliminarBib(id: number) {
    if (!confirm('¿Eliminar biblioteca?')) return;
    this.http.delete(`${this.apiUrl}/bibliotecas/${id}`).subscribe({ next: () => { this.loadBibliotecas(); this.setMsg('Biblioteca eliminada.'); }, error: () => this.setMsg('Error al eliminar.') });
  }

  // ──── Libros CRUD ────
  loadLibros() {
    this.http.get<any[]>(`${this.apiUrl}/libros`).subscribe({ next: d => this.libros = d, error: () => {} });
  }

  abrirCrearLib() {
    this.editLib = null;
    this.lib = { titulo: '', autor: '', categoria: '', bibliotecaId: this.bibliotecas[0]?.id ?? 0 };
    this.showLibForm = true;
  }

  abrirEditLib(l: any) {
    this.editLib = l;
    this.lib = { ...l };
    this.showLibForm = true;
  }

  guardarLib() {
    const body = { ...this.lib, bibliotecaId: Number(this.lib.bibliotecaId) };
    const obs = this.editLib
      ? this.http.put(`${this.apiUrl}/libros/${this.editLib.id}`, body)
      : this.http.post(`${this.apiUrl}/libros`, body);
    obs.subscribe({ next: () => { this.showLibForm = false; this.loadLibros(); this.setMsg(this.editLib ? 'Libro actualizado.' : 'Libro creado.'); }, error: () => this.setMsg('Error al guardar.') });
  }

  eliminarLib(id: number) {
    if (!confirm('¿Eliminar libro?')) return;
    this.http.delete(`${this.apiUrl}/libros/${id}`).subscribe({ next: () => { this.loadLibros(); this.setMsg('Libro eliminado.'); }, error: () => this.setMsg('Error al eliminar.') });
  }

  getBibNombre(id: number) {
    return this.bibliotecas.find(b => b.id === id)?.nombre ?? id;
  }

  setMsg(m: string) { this.msg = m; setTimeout(() => this.msg = '', 3000); }
}
