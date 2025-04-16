export interface Book {
  name?: string;
  title: string;
  author: string;
  quantity: number;
  publisher: string;
  isbn: string;
}

export interface Member {
  name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  outstanding_debt: number;
}

export interface Transaction {
  name?: string;
  book: number;
  member: number;
  date_issued: Date;
  date_due: Date;
  date_returned: Date | null;
  status: 'Issued' | 'Returned' | 'Overdue';
  rent_fee: number;
}

export interface ApiResponse<T> {
  message: T | { error: string };
}
