import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookFormComponent } from './book-form/book-form.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent,
        title:'Página de inicio'
    },
    {
        path:'book-form/:id',
        component:BookFormComponent,
        title:'Formulario de libros'
    },
    {
        path:'**', //Te redirecciona si en determinado caso colocas cualquier ruta, te manda a HOME
        redirectTo:'',
        pathMatch:'full'
    },
];
