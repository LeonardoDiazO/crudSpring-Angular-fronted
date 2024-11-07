import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  private apiUrl = 'http://localhost:8080/book';

  constructor(private http: HttpClient) { }

  // Obtener todos los libros
  getBook(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // Obtener un libro por ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`); 
  }

  // Crear un nuevo libro
  createBook(book: Book, image:File): Observable<Book> {
    const formData = new FormData()
    formData.append('book', new Blob([JSON.stringify(book)], { type: 'application/json'}));
    formData.append('file', image)
    return this.http.post<Book>(this.apiUrl, formData);
  }

  // Actualizar un libro existente
  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}`, book);
  }

  // Eliminar un libro por ID
  deleteBook(id: number): Observable<void> { 
    return this.http.delete<void>(`${this.apiUrl}/${id}`); 
  }

  // Edita el libro con su imagen
  updateBookImage(id: number, image:File): Observable<Book> {
    const formData = new FormData()
    formData.append('file', image)
    return this.http.put<Book>(`${this.apiUrl}/${id}/image`, formData); 
  }
}
