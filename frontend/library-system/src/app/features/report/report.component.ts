import { Component, ViewChild } from '@angular/core';
import { Member, Transaction } from '../../shared/models';
import { BookService } from '../../shared/services/book/book.service';
import { MemberService } from '../../shared/services/member/member.service';
import { TransactionService } from '../../shared/services/transaction/transaction.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-report',
  imports: [CommonModule, CardModule, ButtonModule, TableModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
  @ViewChild('dt') dt!: Table;
  totalBooks: number = 0;
  totalMembers: number = 0;
  issuedBooks: number = 0;
  totalRevenue: number = 0;
  membersWithDebt: Member[] = [];

  transactionChartData: any;
  chartOptions: any;

  constructor(
    private bookService: BookService,
    private memberService: MemberService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.fetchReportData();
  }

  fetchReportData = () => {
    this.bookService.getBooks().subscribe((books) => {
      console.log('books', books);

      this.totalBooks = books.length;
    });

    this.memberService.getMembers().subscribe((members) => {
      if (typeof members !== 'string') {
        this.totalMembers = members.length;
        this.membersWithDebt = members.filter((m) => m.outstanding_debt > 0);
      }
    });

    this.transactionService.getTransactions().subscribe((transactions) => {
      if (typeof transactions !== 'string') {
        this.issuedBooks = transactions.filter(
          (t) => t.status === 'Issued'
        ).length;
        this.totalRevenue = transactions
          .filter((t) => t.status === 'Returned')
          .reduce((acc, t) => acc + t.rent_fee, 0);
      }
    });
  };

  exportCSV() {
    this.dt.exportCSV()
  }
}
