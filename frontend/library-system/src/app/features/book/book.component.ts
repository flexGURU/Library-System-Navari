import { Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookService } from '../../shared/services/book/book.service';
import { Book } from '../../shared/models';
import { NotificationService } from '../../shared/services/notification/notification.service';

@Component({
  selector: 'app-book',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    TableModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  books = signal<Book[]>([]);
  bookDialog: boolean = false;
  bookForm!: FormGroup;
  editingBook: Book | null = null;
  loading: boolean = true;

  constructor(
    private bookService: BookService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchBooks();
    this.initBookForm();
  }

  fetchBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (response) => {
        console.log(response);

        if (typeof response === 'string') {
          this.notificationService.error(response);
        } else {
          this.books.set(response);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching books', error);
        const errorMessage = error.message || 'Failed to load books';
        this.notificationService.error(errorMessage);
        this.loading = false;
      },
    });
  }

  initBookForm(book?: Book): void {
    this.bookForm = this.fb.group({
      title: [book?.title || '', Validators.required],
      author: [book?.author || '', Validators.required],
      quantity: [book?.quantity || 1, [Validators.required, Validators.min(1)]],
      isbn: [book?.isbn || '', Validators.required],
      publisher: [book?.isbn || '', Validators.required],
    });
  }

  openBookDialog(): void {
    this.editingBook = null;
    // this.initBookForm();
    this.bookDialog = true;
  }

  editBook(book: Book): void {
    this.editingBook = book;
    console.log(this.editingBook);

    this.initBookForm(book);
    this.bookDialog = true;
  }

  saveBook(): void {
    if (this.bookForm.invalid) return;

    const bookData = this.bookForm.value;

    if (this.editingBook && this.editingBook.name) {
      this.bookService.updateBook(this.editingBook.name, bookData).subscribe({
        next: (response) => {
          if (typeof response === 'string') {
            this.notificationService.error(response);
          } else {
            this.bookDialog = false;
            this.notificationService.success('Book updated');
            this.fetchBooks();
          }
        },
        error: (error) => {
          console.error('Error updating book', error);
          this.notificationService.error('Failed to update book');
        },
      });
    } else {
      this.bookService.addBook(bookData).subscribe({
        next: (response) => {
          if (typeof response === 'string') {
            this.notificationService.error(response);
          } else {
            this.fetchBooks();
            this.notificationService.success('Book has been addded');
            this.bookDialog = false;
            this.bookForm.reset();
          }
        },
        error: (error) => {
          console.error('Error adding book', error);
          this.notificationService.error(error);
        },
      });
    }
  }

  confirmDelete(book: Book): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete The Book "${book.title}"?`,
      accept: () => {
        if (book && book.name) {
          this.bookService.deleteBook(book.name).subscribe({
            next: () => {
              this.notificationService.success('Book deleted succesfully');
              this.fetchBooks();
            },
            error: (error) => {
              this.notificationService.error('Failed to delete book');
            },
          });
        }
      },
    });
  }
}
