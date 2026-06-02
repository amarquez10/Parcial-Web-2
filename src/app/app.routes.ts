import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BibliotecasComponent } from './components/bibliotecas/bibliotecas.component';
import { LibrosComponent } from './components/libros/libros.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bibliotecas', component: BibliotecasComponent },
  { path: 'libros', component: LibrosComponent },
  { path: '**', redirectTo: '' }
];
