import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BookService } from '../services/book.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';


@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, 
            ButtonModule, 
            RouterModule,
            InputTextModule,
            InputNumberModule,
            CardModule,
            FileUploadModule
          ], //C:\Users\Maximun_neo\frontend-crud\src\app\book-form\book-form.component.html
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent {
  formBook!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formBook = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      autor: ['', Validators.required],
      pages: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id != 'new'){
      this.edit = true;
      this.getBookById(+id!);
    }
  }

  //Meodo para seleccionar los archivos
  onFileSelected(event:FileSelectEvent){
    this.selectedFile = event.files[0];	
  }

  getBookById(id: number){
    this.bookService.getBookById(id).subscribe({
      next:foundBook => {
        this.formBook.patchValue(foundBook);
      },
      error:()=> {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No encontrado',
        });
        this.router.navigateByUrl('/')
      },
    })
  }

  createBook(){
    if(this.formBook.invalid){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return 
    }
    if(!this.selectedFile){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione una imagen e intente nuevamnente',
      });
      return 
    }
    this.isSaveInProgress = true;
    this.bookService.createBook(this.formBook.value, this.selectedFile).subscribe({
      next:()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Libro guardado correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/')
      },
      error:()=>{
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise los campos e intente nuevamente',
        });
      }


    })
  }
  
  changeImagen(){
    if(!this.selectedFile){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione una imagen e intente nuevamnente',
      });
      return 
    }
    this.bookService.updateBookImage(this.formBook.value.id, this.selectedFile).subscribe({
      next:()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Libro actualizado correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/');
      },
      error:()=>{
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise archivo seleccionado',
        });
      }
    })
  }
  
  updateBook(){
    if(this.formBook.invalid){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return 
    }
    this.isSaveInProgress = true;
    this.bookService.updateBook(this.formBook.value).subscribe({
      next:()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Libro guardado correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/')
      },
      error:()=>{
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise los campos e intente nuevamente',
        });
      }


    })
  }


}
