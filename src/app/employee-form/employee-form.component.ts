import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';


@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        RouterModule,
        InputTextModule,
        InputNumberModule,
        CardModule,
        FileUploadModule,
        CommonModule,
        CalendarModule
    ],
    templateUrl: './employee-form.component.html',
    styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent {
    formEmployee!: FormGroup;
    isSaveInProgress: boolean = false;
    edit: boolean = false;
    selectedFile: File | null = null;
    imagePreview: string | null = null;

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private router: Router
    ) {
        this.formEmployee = this.fb.group({
            id: [null],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            position: ['', Validators.required],
            department: ['', Validators.required],
            salary: [0, [Validators.required, Validators.min(0)]],
            hireDate: [null, Validators.required],
            phone: ['', Validators.required],
            image: [null]
        });
    }

    ngOnInit(): void {
        let id = this.activatedRoute.snapshot.paramMap.get('id');

        if (id != 'new') {
            this.edit = true;
            this.getEmployeeById(+id!);
        }
    }

    // Método para seleccionar los archivos
    onFileSelected(event: FileSelectEvent) {
        this.selectedFile = event.files[0];

        // Generate preview
        if (this.selectedFile) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    getEmployeeById(id: number) {
        this.employeeService.getEmployeeById(id).subscribe({
            next: foundEmployee => {
                this.formEmployee.patchValue(foundEmployee);
                // Set preview for existing image
                if (foundEmployee.image?.imgUrl) {
                    this.imagePreview = foundEmployee.image.imgUrl;
                }
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Empleado no encontrado',
                });
                this.router.navigateByUrl('/');
            },
        });
    }

    createEmployee() {
        if (this.formEmployee.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Revise los campos e intente nuevamente',
            });
            return;
        }
        if (!this.selectedFile) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Seleccione una imagen e intente nuevamente',
            });
            return;
        }
        this.isSaveInProgress = true;
        this.employeeService.createEmployee(this.formEmployee.value, this.selectedFile).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Guardado',
                    detail: 'Empleado guardado correctamente',
                });
                this.isSaveInProgress = false;
                this.router.navigateByUrl('/');
            },
            error: () => {
                this.isSaveInProgress = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Revise los campos e intente nuevamente',
                });
            }
        });
    }

    changeImage(event: FileSelectEvent) {
        this.selectedFile = event.files[0];

        // Generate preview
        if (this.selectedFile) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(this.selectedFile);
        }

        if (!this.selectedFile) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Seleccione una imagen e intente nuevamente',
            });
            return;
        }
        this.employeeService.updateEmployeeImage(this.formEmployee.value.id, this.selectedFile).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Guardado',
                    detail: 'Empleado actualizado correctamente',
                });
                this.isSaveInProgress = false;
                this.router.navigateByUrl('/');
            },
            error: () => {
                this.isSaveInProgress = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Revise archivo seleccionado',
                });
            }
        });
    }

    updateEmployee() {
        if (this.formEmployee.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Revise los campos e intente nuevamente',
            });
            return;
        }
        this.isSaveInProgress = true;
        this.employeeService.updateEmployee(this.formEmployee.value).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Actualizado',
                    detail: 'Empleado actualizado correctamente',
                });
                this.isSaveInProgress = false;
                this.router.navigateByUrl('/');
            },
            error: () => {
                this.isSaveInProgress = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Revise los campos e intente nuevamente',
                });
            }
        });
    }
}
