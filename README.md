# Library Management System

A complete library management solution built with Frappe (Python backend) and Angular (frontend) that handles books, members, and transactions with business logic enforcement.
## System Demonstration

<<<<<<< HEAD
<iframe 
    src="https://drive.google.com/file/d/1R96uzbvD_Q7PHi2pJ_vn0l1KLKg_hMgL/preview" 
    width="640" 
    height="480" 
    allow="autoplay"
    style="border:none;"
></iframe>
=======

>>>>>>> 98ed424124b0795670e99a7eadc3d373ba03211b
## System Architecture

## Features

### 📚 Book Management
- CRUD operations for books
- Track inventory (quantity/available quantity)
- Search by title/author

### 👥 Member Management
- Member registration and management
- Debt tracking (with KES 500 limit)
- Contact information storage

### 🔄 Transaction Management
- Book issuing/returning
- Automatic status updates
- Rent fee calculation
- Debt enforcement

## Schema
![schema](https://github.com/user-attachments/assets/8e3baa70-1ecd-4388-bfcc-87ba52f4b092)


## API Documentation

### Book Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/method/library_management.book.get_book` | Get all books or specific book | `book_name` (optional) |
| `POST` | `/api/method/library_management.book.create_book` | Create new book | `title`, `author`, `isbn`, `publisher`, `quantity` |
| `PUT` | `/api/method/library_management.book.update_book` | Update book | `book_name`, `title`/`author`/`isbn`/`publisher`/`quantity` |
| `DELETE` | `/api/method/library_management.book.delete_book` | Delete book | `book_name` |

### Member Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/method/library_management.member.get_members` | Get all members or specific member | `email` (optional) |
| `POST` | `/api/method/library_management.member.create_member` | Create new member | `first_name`, `last_name`, `email`, `phone` |
| `PUT` | `/api/method/library_management.member.update_member` | Update member | `member_id`, `first_name`/`last_name`/`email`/`phone`/`outstanding_debt` |
| `DELETE` | `/api/method/library_management.member.delete_member` | Delete member | `member_id` |

### Transaction Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/method/library_management.transaction.get_transactions` | Get all transactions or specific | `transaction_id` (optional) |
| `POST` | `/api/method/library_management.transaction.issue_book` | Issue book to member | `book_name`, `email` |
| `POST` | `/api/method/library_management.transaction.return_book` | Return book | `transaction_id`, `rent_fee` |
| `GET` | `/api/method/library_management.transaction.search_books` | Search books | `author` or `title` |

## Business Rules

1. **Debt Limit**: Members cannot borrow books if outstanding debt > KES 500
   ```python
   if member.outstanding_debt > 500:
       return {"message": "Member has reached debt limit of KES 500"}```


```mermaid
sequenceDiagram
    Angular->>+Frappe: POST /issue_book
    Frappe->>+Database: Check member debt
    Database-->>-Frappe: Debt amount
    Frappe->>Angular: Success/Error response
