import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BibliotecaService } from '../../services/biblioteca.service';
import { LibroService } from '../../services/libro.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  totalBibliotecas = 0;
  totalLibros = 0;
  backendOk = false;
  loading = true;

  constructor(
    private bibliotecaService: BibliotecaService,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {
    this.bibliotecaService.getAll().subscribe({
      next: (data) => {
        this.totalBibliotecas = data.length;
        this.backendOk = true;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.libroService.getAll().subscribe({
      next: (data) => { this.totalLibros = data.length; },
      error: () => {}
    });
  }
}
