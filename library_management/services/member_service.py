import frappe
from frappe import _


class MemberService:
    def __init__(self):
        self.doctype = "Member"

    def get_member(self, email=None):
        try:
            if not email:
                members = frappe.get_all(
                    self.doctype,
                    fields=[
                        "name",
                        "first_name",
                        "last_name",
                        "email",
                        "phone",
                        "outstanding_debt",
                    ],
                )
                return members
            member = frappe.db.get_value(
                self.doctype,
                email,
                ["first_name", "last_name", "email", "phone", "outstanding_debt"],
                as_dict=True,
            )
            return member
        except frappe.DoesNotExistError:
            return {"error": "Member not found"}
        except Exception as e:
            return {"error fetching data": str(e)}

    def create_member(self, member_data):
        try:
            new_member = frappe.get_doc({"doctype": self.doctype})

            new_member.first_name = member_data["first_name"]
            new_member.last_name = member_data["last_name"]
            new_member.email = member_data["email"]
            new_member.phone = member_data["phone"]

            new_member.save()
            return new_member

        except frappe.DuplicateEntryError as e:

            return {"error": "  Member with this email or Phone Number already exists"}

        except Exception as e:
            return {"error": str(e)}

    def update_member(self, email, update_data):
        try:

            member = frappe.get_doc(self.doctype, email)

            if "first_name" in update_data:
                member.db_set("first_name", update_data["first_name"])
            if "last_name" in update_data:
                member.db_set("last_name", update_data["last_name"])
            if "email" in update_data:
                member.db_set("email", update_data["email"])
            if "phone" in update_data:
                member.db_set("phone", update_data["phone"])
            if "outstanding_debt" in update_data:
                member.db_set("outstanding_debt", update_data["outstanding_debt"])

            member.reload()
            return member

        except frappe.DoesNotExistError as e:
            return {"error": "member does not exist"}

        except Exception as e:
            return {"error fetching data": str(e)}

    def delete_member(self, email):
        try:
            member = frappe.get_doc(self.doctype, email)
            member.delete()

            frappe.db.commit()
            return {"message": "Member deleted successfully"}

        except frappe.DoesNotExistError as e:
            return {"error": "member does not exist"}

        except Exception as e:
            return {"error fetching data": str(e)}
