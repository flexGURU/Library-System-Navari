import { Component, signal, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Transaction, Book, Member } from '../../shared/models';
import { TransactionService } from '../../shared/services/transaction/transaction.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { BookService } from '../../shared/services/book/book.service';
import { MemberService } from '../../shared/services/member/member.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-transaction',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    ToastModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent {
  @ViewChild('dt') table!: Table;
  transactions = signal<Transaction[]>([]);
  books = signal<Book[]>([]);
  members = signal<Member[]>([]);
  loading: boolean = true;

  issueDialog: boolean = false;
  returnDialog: boolean = false;
  issueForm!: FormGroup;

  selectedTransaction: Transaction | null = null;
  selectedMember: Member | null = null;
  calculatedFee: number = 0;

  constructor(
    private memberService: MemberService,
    private bookService: BookService,
    private transactionService: TransactionService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchTransactions();
    this.fetchBooks();
    this.fetchMembers();
    this.initIssueForm();
  }

  fetchTransactions(): void {
    this.loading = true;
    this.transactionService.getTransactions().subscribe({
      next: (response) => {
        console.log(response);

        if (typeof response === 'string') {
          this.notificationService.error(response);
        } else {
          this.transactions.set(response);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions', error);
        this.notificationService.error('Failed to load Transa');
        this.loading = false;
      },
    });
  }

  fetchBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (response) => {
        if (typeof response === 'string') {
          this.notificationService.error(response);
        } else {
          const books = response.filter((book) => book.quantity > 0);
          this.books.set(books);
        }
      },
      error: (error) => {
        console.error('Error fetching books', error);
        const errorMessage = error.message || 'Failed to load books';
        this.notificationService.error(errorMessage);
        this.loading = false;
      },
    });
  }

  fetchMembers(): void {
    this.loading = true;
    this.memberService.getMembers().subscribe({
      next: (response) => {
        console.log(response);

        if (typeof response === 'string') {
          this.notificationService.error(response);
        } else {
          this.members.set(response);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching members', error);
        this.notificationService.error('Failed to load Members');
        this.loading = false;
      },
    });
  }

  initIssueForm(): void {
    this.issueForm = this.fb.group({
      book_id: ['', Validators.required],
      member_id: ['', Validators.required],
    });

    // Watch for member changes to check debt
    this.issueForm.get('member_id')?.valueChanges.subscribe((memberId) => {
      if (memberId) {
        this.selectedMember =
          this.members().find((m) => m.name === memberId) || null;
      } else {
        this.selectedMember = null;
      }
    });
  }

  openIssueBookDialog(): void {
    this.initIssueForm();
    this.issueDialog = true;
  }

  openReturnDialog(transaction: Transaction): void {
    this.selectedTransaction = transaction;

    // Calculate fee based on days (simplified example)
    const issueDate = new Date(transaction.date_issued);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - issueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Example: 10 KES per day
    this.calculatedFee = diffDays * 100;

    this.returnDialog = true;
  }

  issueBook(): void {
    if (this.issueForm.invalid) return;
    const { book_id, member_id } = this.issueForm.value;
    this.transactionService.issueBook(book_id, member_id).subscribe({
      next: (response) => {
        if (typeof response === 'string') {
          this.notificationService.error(response);
        } else {
          this.notificationService.success('Book has been Issued successfully');
          this.issueDialog = false;
          this.fetchBooks();
          this.fetchTransactions();
        }
      },
      error: (error) => {
        console.error('Error issuing book', error);
        this.notificationService.error('Failed to issue book');
      },
    });
  }

  returnBook(): void {
    if (this.selectedTransaction && this.selectedTransaction.name) {
      this.transactionService
        .returnBook(this.selectedTransaction.name, this.calculatedFee)
        .subscribe({
          next: (response) => {
            if (typeof response === 'string') {
              this.notificationService.error(response);
            } else {
              this.notificationService.success('Book returned Successfuly');
              this.returnDialog = false;
              this.fetchBooks();
              this.fetchMembers();
              this.fetchTransactions();
            }
          },
          error: (error) => {
            console.error('Error returning book', error);
            this.notificationService.error('Failed to return book');
          },
        });
    }
  }

  getSeverity(status: string): any {
    switch (status) {
      case 'Issued':
        return 'warn';
      case 'Returned':
        return 'success';
      default:
        return 'info';
    }
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.table.filterGlobal(value, 'contains');
  }
}
