import frappe
from . import books, members, transactions


def setup_api():
    # Book endpoints
    frappe.add_handler("api/v1/books", books.get_book, method="GET")
    frappe.add_handler("api/v1/books", books.create_book, method="POST")
    frappe.add_handler("api/v1/books", books.update_book, method="PUT")
    frappe.add_handler("api/v1/books", books.delete_book, method="DELETE")

    # Member endpoints
    frappe.add_handler("api/v1/members", books.get_member, method="GET")
    frappe.add_handler("api/v1/members", books.create_member, method="POST")
    frappe.add_handler("api/v1/members", books.update_member, method="PUT")
    frappe.add_handler("api/v1/members", books.delete_member, method="DELETE")

    # Transaction endpoints
    frappe.add_handler("api/v1/transactions", books.get_transaction, method="GET")
    frappe.add_handler("api/v1/transactions/issue", books.issue_book, method="POST")
    frappe.add_handler("api/v1/transactions/return", books.return_book, method="POST")

    # Search endpoint
    frappe.add_handler("api/v1/search", books.search_book, method="GET")
