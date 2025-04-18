# Library Management System

A complete library management solution built with Frappe (Python backend) and Angular (frontend) that handles books, members, and transactions with business logic enforcement.
## System Demonstration 📹

[![Watch Library System Demo](https://img.shields.io/badge/▶_Watch_Full_Demo_Video-4285F4?style=for-the-badge&logo=google-drive&logoColor=white)](https://drive.google.com/file/d/1R96uzbvD_Q7PHi2pJ_vn0l1KLKg_hMgL/view?usp=sharing)

**Features shown in demo:**
- Book issuing workflow
- Member debt validation
- Transaction processing
- Responsive UI interactions

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
![dashboard](https://github.com/user-attachments/assets/2c9561e3-8b20-4949-962d-620510fbb230)
![book](https://github.com/user-attachments/assets/9b2743d2-754e-4481-adc7-6afb60b20849)
![member](https://github.com/user-attachments/assets/a765158d-b01b-4c08-b26a-1f29a99b149e)
![transaction](https://github.com/user-attachments/assets/ddc1055b-733e-4c6e-ba78-31261970ad0d)
![issue](https://github.com/user-attachments/assets/b6e91746-60bf-4ec5-a103-112f5aa3ac80)
![reportts](https://github.com/user-attachments/assets/2b0bb1f5-9238-47cc-963e-c6d484789079)



