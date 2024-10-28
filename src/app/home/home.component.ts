import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, RouterModule, ToastModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  books:Book[] = [];
  isDeleteInProgress:boolean = false;

  constructor(private bookService: BookService,
              private messageService: MessageService
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllBooks();

    
  }

  getAllBooks(){
    this.bookService.getBook().subscribe((data) =>{
      this.books = data;
    });
  }

  deleteBook(id:number){

    this.isDeleteInProgress = true;
    this.bookService.deleteBook(id).subscribe({
      next:()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Libro eliminado ',
        });
        this.isDeleteInProgress = true;
        this.getAllBooks();
      },
      error:()=>{
        this.isDeleteInProgress = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el libro',
        });
      }


    })
  }


}
