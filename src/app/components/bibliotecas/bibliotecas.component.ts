import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Biblioteca } from '../../models/biblioteca.model';
import { BibliotecaService } from '../../services/biblioteca.service';

@Component({
  selector: 'app-bibliotecas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bibliotecas.component.html',
  styleUrl: './bibliotecas.component.css'
})
export class BibliotecasComponent implements OnInit {
  bibliotecas: Biblioteca[] = [];
  loading = false;
  error = '';
  successMsg = '';

  showForm = false;
  editMode = false;
  selectedId: number | null = null;

  formData: Biblioteca = {
    nombre: '',
    direccion: '',
    telefono: '',
    responsable: ''
  };

  constructor(private bibliotecaService: BibliotecaService) {}

  ngOnInit(): void {
    this.loadBibliotecas();
  }

  loadBibliotecas(): void {
    this.loading = true;
    this.error = '';
    this.bibliotecaService.getAll().subscribe({
      next: (data) => {
        this.bibliotecas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las bibliotecas. ¿Está el backend corriendo?';
        this.loading = false;
      }
    });
  }

  openCreate(): void {
    this.editMode = false;
    this.selectedId = null;
    this.formData = { nombre: '', direccion: '', telefono: '', responsable: '' };
    this.showForm = true;
    this.error = '';
    this.successMsg = '';
  }

  openEdit(b: Biblioteca): void {
    this.editMode = true;
    this.selectedId = b.id!;
    this.formData = { ...b };
    this.showForm = true;
    this.error = '';
    this.successMsg = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.error = '';
  }

  save(): void {
    if (this.editMode && this.selectedId !== null) {
      this.bibliotecaService.update(this.selectedId, this.formData).subscribe({
        next: () => {
          this.successMsg = '¡Biblioteca actualizada exitosamente!';
          this.showForm = false;
          this.loadBibliotecas();
          setTimeout(() => this.successMsg = '', 3000);
        },
        error: () => { this.error = 'Error al actualizar la biblioteca.'; }
      });
    } else {
      this.bibliotecaService.create(this.formData).subscribe({
        next: () => {
          this.successMsg = '¡Biblioteca creada exitosamente!';
          this.showForm = false;
          this.loadBibliotecas();
          setTimeout(() => this.successMsg = '', 3000);
        },
        error: () => { this.error = 'Error al crear la biblioteca.'; }
      });
    }
  }

  delete(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta biblioteca?')) return;
    this.bibliotecaService.delete(id).subscribe({
      next: () => {
        this.successMsg = 'Biblioteca eliminada.';
        this.loadBibliotecas();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.error = 'Error al eliminar la biblioteca.'; }
    });
  }
}
