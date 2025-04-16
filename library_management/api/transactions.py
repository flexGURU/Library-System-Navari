from library_management.services.transation_service import TransactionService
from frappe import _
import frappe

transaction_service = TransactionService()


@frappe.whitelist(allow_guest=True)
def get_transaction():
    id = frappe.request.args.get("transaction_id")

    return transaction_service.get_transactions(id)


@frappe.whitelist(allow_guest=True)
def issue_book():
    transaction_data = frappe.local.form_dict

    book_name = transaction_data["book_name"]
    email = transaction_data["email"]

    return transaction_service.issue_book(book_name, email)


@frappe.whitelist(allow_guest=True)
def return_book():
    request_data = frappe.local.form_dict

    transaction_id = request_data["transaction_id"]
    rent_fee = request_data["rent_fee"]

    return transaction_service.return_book(transaction_id, rent_fee)


@frappe.whitelist(allow_guest=True)
def search_book():
    author = frappe.request.args.get("author")
    title = frappe.request.args.get("title")

    return transaction_service.search_books(author=author, title=title)
