import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Libro } from '../../models/libro.model';
import { Biblioteca } from '../../models/biblioteca.model';
import { LibroService } from '../../services/libro.service';
import { BibliotecaService } from '../../services/biblioteca.service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})
export class LibrosComponent implements OnInit {
  libros: Libro[] = [];
  bibliotecas: Biblioteca[] = [];
  loading = false;
  error = '';
  successMsg = '';

  showForm = false;
  editMode = false;
  selectedId: number | null = null;

  formData: Libro = {
    titulo: '',
    autor: '',
    categoria: '',
    bibliotecaId: 0
  };

  constructor(
    private libroService: LibroService,
    private bibliotecaService: BibliotecaService
  ) {}

  ngOnInit(): void {
    this.loadLibros();
    this.loadBibliotecas();
  }

  loadLibros(): void {
    this.loading = true;
    this.error = '';
    this.libroService.getAll().subscribe({
      next: (data) => {
        this.libros = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los libros. ¿Está el backend corriendo?';
        this.loading = false;
      }
    });
  }

  loadBibliotecas(): void {
    this.bibliotecaService.getAll().subscribe({
      next: (data) => { this.bibliotecas = data; },
      error: () => {}
    });
  }

  getBibliotecaNombre(id: number): string {
    const b = this.bibliotecas.find(bib => bib.id === id);
    return b ? b.nombre : `Biblioteca #${id}`;
  }

  openCreate(): void {
    this.editMode = false;
    this.selectedId = null;
    this.formData = { titulo: '', autor: '', categoria: '', bibliotecaId: this.bibliotecas[0]?.id || 0 };
    this.showForm = true;
    this.error = '';
    this.successMsg = '';
  }

  openEdit(l: Libro): void {
    this.editMode = true;
    this.selectedId = l.id!;
    this.formData = { ...l };
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
      this.libroService.update(this.selectedId, this.formData).subscribe({
        next: () => {
          this.successMsg = '¡Libro actualizado exitosamente!';
          this.showForm = false;
          this.loadLibros();
          setTimeout(() => this.successMsg = '', 3000);
        },
        error: () => { this.error = 'Error al actualizar el libro.'; }
      });
    } else {
      this.libroService.create(this.formData).subscribe({
        next: () => {
          this.successMsg = '¡Libro creado exitosamente!';
          this.showForm = false;
          this.loadLibros();
          setTimeout(() => this.successMsg = '', 3000);
        },
        error: () => { this.error = 'Error al crear el libro. Verifica que la biblioteca exista.'; }
      });
    }
  }

  delete(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este libro?')) return;
    this.libroService.delete(id).subscribe({
      next: () => {
        this.successMsg = 'Libro eliminado.';
        this.loadLibros();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.error = 'Error al eliminar el libro.'; }
    });
  }

  getCategoriaClass(categoria: string): string {
    const map: { [key: string]: string } = {
      'fiction': 'cat-fiction', 'ficción': 'cat-fiction',
      'ciencia': 'cat-science', 'science': 'cat-science',
      'historia': 'cat-history', 'history': 'cat-history',
      'tecnología': 'cat-tech', 'tech': 'cat-tech',
    };
    return map[categoria.toLowerCase()] || 'cat-default';
  }
}
