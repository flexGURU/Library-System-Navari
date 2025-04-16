import frappe
from frappe import _
from datetime import datetime


class TransactionService:
    def __init__(self):
        self.transaction = "Transaction"
        self.book = "Book"
        self.member = "Member"

    def get_transactions(self, transaction_id=None):
        try:
            if not transaction_id:
                transactions = frappe.get_all(
                    self.transaction,
                    fields=[
                        "name",
                        "member",
                        "book",
                        "date_issued",
                        "date_due",
                        "date_returned",
                        "status",
                        "rent_fee",
                    ],
                )

                return transactions

            transaction = frappe.get_doc(self.transaction, transaction_id)

            return transaction

        except frappe.DoesNotExistError:
            return {"error": "Transaction not found"}
        except Exception as e:
            return {"error fetching transaction": str(e)}

    def search_books(self, author=None, title=None):
        try:
            filters = []

            if author:
                author_pattern = f"%{author}%"
                filters.append([self.book, "author", "like", author_pattern])

            if title:
                title_pattern = f"%{title}%"
                if filters:
                    filters.append("OR")
                filters.append([self.book, "title", "like", title_pattern])

            if not filters:
                return []

            search_result = frappe.get_all(
                self.book,
                filters=filters,
                fields=["name", "book_name", "author", "isbn", "publisher", "quantity"],
            )

            return search_result

        except frappe.DoesNotExistError:
            return {"error": "Transaction not found"}

        except Exception as e:
            return {"error": str(e)}

    def issue_book(self, book_name, email):
        try:
            frappe.db.begin()
            frappe.log(f"book_name: {book_name}")
            frappe.log(f"email: {email}")

            book = frappe.get_doc(self.book, book_name)

            if book.quantity <= 0:
                return {"message": "Book is out of stock"}

            member = frappe.get_doc(self.member, email)
            if member.outstanding_debt > 500:
                return {"message": "Member has reached debt limit of KES 500"}

            transaction = self.create_transaction(book_name, email)

            book.quantity -= 1
            book.save()

            frappe.db.commit()
            return transaction

        except frappe.DoesNotExistError:
            frappe.db.rollback()
            return {"error": "Invalid Request. Member or Book not found"}

    def create_transaction(self, book_name, member_email):
        try:
            new_transaction = frappe.get_doc({"doctype": self.transaction})

            new_transaction.book = book_name
            new_transaction.member = member_email
            new_transaction.date_due = frappe.utils.add_to_date(datetime.now(), days=14)
            new_transaction.status = "Issued"

            new_transaction.insert()
            return new_transaction

        except Exception as e:
            return {"error": str(e)}

    def return_book(self, transaction_id, rent_fee):
        try:
            frappe.db.begin()
            transaction = frappe.get_doc(self.transaction, transaction_id)

            if transaction.status == "Returned":
                return {"message": "book is already returned"}

            self.update_transaction(transaction, rent_fee)
            self.update_book(transaction)
            self.update_member_debt(transaction, rent_fee)

            frappe.db.commit()
            return transaction

        except frappe.DoesNotExistError:
            frappe.db.rollback()
            return {"error": "Transaction not found"}
        except Exception as e:
            frappe.db.rollback()
            return {"error returning a book": str(e)}

    def update_transaction(self, transaction, rent_fee):

        try:
            transaction.date_returned = frappe.utils.add_to_date(datetime.now(), days=5)
            transaction.status = "Returned"
            transaction.rent_fee = rent_fee
            transaction.save()

        except Exception as e:
            return {"error updating transaction": str(e)}

    def update_book(self, transaction):
        try:
            book = frappe.get_doc(self.book, transaction.book)
            book.quantity += 1
            book.save()

        except Exception as e:
            return {"error updating transaction": str(e)}

    def update_member_debt(self, transaction, rent_fee):
        try:
            member = frappe.get_doc(self.member, transaction.member)
            member.outstanding_debt += rent_fee
            member.save()

        except Exception as e:
            return {"error updating transaction": str(e)}
