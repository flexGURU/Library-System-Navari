from library_management.services.member_service import MemberService
from frappe import _
import frappe

member_service = MemberService()


@frappe.whitelist(allow_guest=True)
def get_members():
    email = frappe.request.args.get("email")
    return member_service.get_member(email)


@frappe.whitelist(allow_guest=True)
def create_member():
    member_data = frappe.local.form_dict
    return member_service.create_member(member_data)


@frappe.whitelist(allow_guest=True)
def update_member():
    member_data = frappe.local.form_dict
    member_id = frappe.request.args.get("member_id")
    update_data = member_data

    return member_service.update_member(member_id, update_data)


@frappe.whitelist(allow_guest=True)
def delete_member():
    member_id = frappe.request.args.get("member_id")

    return member_service.delete_member(member_id)
