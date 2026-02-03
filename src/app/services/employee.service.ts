import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private apiUrl = 'http://localhost:8080/employee';

    constructor(private http: HttpClient) { }

    // Obtener todos los empleados
    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiUrl);
    }

    // Obtener un empleado por ID
    getEmployeeById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${id}`);
    }

    // Crear un nuevo empleado
    createEmployee(employee: Employee, image: File): Observable<Employee> {
        const formData = new FormData();
        formData.append('employee', new Blob([JSON.stringify(employee)], { type: 'application/json' }));
        formData.append('file', image);
        return this.http.post<Employee>(this.apiUrl, formData);
    }

    // Actualizar un empleado existente
    updateEmployee(employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}`, employee);
    }

    // Eliminar un empleado por ID
    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Actualizar la imagen del empleado
    updateEmployeeImage(id: number, image: File): Observable<Employee> {
        const formData = new FormData();
        formData.append('file', image);
        return this.http.put<Employee>(`${this.apiUrl}/${id}/image`, formData);
    }
}
