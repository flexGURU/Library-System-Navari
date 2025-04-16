import frappe
from frappe import _

doctype = "Book"


class BookService:
    def __init__(self):
        self.doctype = doctype

    def get_book(self, book_name=None):
        try:
            if not book_name:
                books = frappe.get_all(
                    self.doctype,
                    fields=["name", "title", "author", "quantity", "isbn", "publisher"],
                )

                return books

            book = frappe.db.get_value(
                self.doctype,
                book_name,
                ["title", "author", "quantity", "isbn", "publisher"],
                as_dict=True,
            )

            return book
        except frappe.DoesNotExistError:
            return {"error": "Book not found"}
        except Exception as e:
            return {"error fetching data": str(e)}

    def create_book(self, book_data):
        try:

            new_book = frappe.get_doc({"doctype": self.doctype})

            new_book.title = book_data["title"]
            new_book.author = book_data["author"]
            new_book.isbn = book_data["isbn"]
            new_book.publisher = book_data["publisher"]
            new_book.quantity = book_data["quantity"]

            new_book.insert()

            return new_book

        except frappe.DuplicateEntryError as e:

            return {"error": "book with this title already exists"}

        except Exception as e:
            return {"error": str(e)}

    def update_book(self, book_name, update_data):
        try:
            book_doc = frappe.get_doc(self.doctype, book_name)

            if "title" in update_data:
                book_doc.db_set("title", update_data["title"])
            if "author" in update_data:
                book_doc.db_set("author", update_data["author"])
            if "isbn" in update_data:
                book_doc.db_set("isbn", update_data["isbn"])
            if "publisher" in update_data:
                book_doc.db_set("publisher", update_data["publisher"])
            if "quantity" in update_data:
                book_doc.db_set("quantity", update_data["quantity"])
            if "available_quantity" in update_data:
                book_doc.db_set(
                    "available_quantity", update_data["availaible_quantity"]
                )

            book_doc.reload()
            return book_doc

        except frappe.DoesNotExistError:
            return {"error": ("Book not found.")}

        except Exception as e:
            return {"error": str(e)}

    def delete_book(self, book_name):
        try:
            book_doc = frappe.get_doc(self.doctype, book_name)
            book_doc.delete()
            frappe.db.commit()
            return {"message": "Book deleted successfully"}

        except frappe.DoesNotExistError:
            return {"error": "Book not found"}
        except Exception as e:
            return {"error": str(e)}
