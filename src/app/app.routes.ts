import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Gestión de Empleados'
    },
    {
        path: 'employee-form/:id',
        component: EmployeeFormComponent,
        title: 'Formulario de Empleado'
    },
    {
        path: '**', //Te redirecciona si en determinado caso colocas cualquier ruta, te manda a HOME
        redirectTo: '',
        pathMatch: 'full'
    },
];

