import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, RouterModule, TableModule, ConfirmDialogModule, CommonModule],
  providers: [ConfirmationService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  employees: Employee[] = [];
  isDeleteInProgress: boolean = false;
  viewMode: 'table' | 'cards' = 'table'; // Default to table view
  selectedEmployees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
    });
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }

  confirmDelete(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de que deseas eliminar este empleado?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteEmployee(id);
      }
    });
  }

  deleteEmployee(id: number) {
    this.isDeleteInProgress = true;
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Empleado eliminado',
        });
        this.isDeleteInProgress = false;
        this.getAllEmployees();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el empleado',
        });
      }
    })
  }


}
