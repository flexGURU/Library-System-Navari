from library_management.services.book_service import BookService
from frappe import _
import frappe

book_service = BookService()


@frappe.whitelist(allow_guest=True)
def get_book():
    book_name = frappe.request.args.get("book_name")
    return book_service.get_book(book_name)


@frappe.whitelist(allow_guest=True)
def create_book(**kwargs):
    return book_service.create_book(kwargs)


@frappe.whitelist(allow_guest=True)
def update_book():
    book_data = frappe.local.form_dict
    book_name = frappe.request.args.get("book_name")

    return book_service.update_book(book_name, book_data)


@frappe.whitelist(allow_guest=True)
def delete_book():
    book_name = frappe.request.args.get("book_name")

    return book_service.delete_book(book_name)
