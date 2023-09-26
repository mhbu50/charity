# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import frappe
import json
from frappe import utils
from frappe import _
from frappe.model.mapper import get_mapped_doc
from frappe.model.document import Document
from frappe.utils import cstr, flt, getdate, comma_and, cint, nowdate, add_days


@frappe.whitelist()
def make_coupon(source_name, target_doc=None):
    def set_missing_values(source, target):
        # target.production_item = "ffff"
        pass

    target_doc = get_mapped_doc("Request Form", source_name, {
        "Request Form": {
            "doctype": "Coupon",
            "field_map": {
                "file_number": "file_number",
                "name": "request_number"
            }
        }
    }, target_doc, set_missing_values)
    return target_doc


def stop_hoard():
    clients = frappe.get_list("Client", filters={"joining_type": (
        "in", ['شامل مؤقت', 'مؤونة'])}, fields=["*"])

    for client in clients:
        # print "utils.today() = {} client.end_date = {}".format(type(utils.today()),type(client.end_date))
        if str(client.end_date) == str(utils.today()):
            frappe.set_value('Client', client.name, 'joining_type', "موقوف")


@frappe.whitelist()
def get_entitlements(doc_name):
    coupon = frappe.get_list("Coupon",filters={"file_number": doc_name},fields=["*"])
    cheque_specification = frappe.get_list("Cheque Specification",filters={"file_number": doc_name},fields=["*"])
    return {"coupon":coupon,"cheque_specification":cheque_specification}


def boot_session(bootinfo):

    files_without_request = frappe.db.sql(""" Select name as "رقم الملف", full_name as "الاسم "
    from tabClient  
    where   name not in 
    (select file_number from `tabRequest Form` where  date_of_request > DATE_SUB(CURDATE(),INTERVAL 2 YEAR) )""", as_dict=1)

    male_orphans = frappe.db.sql(""" select c.name 'رقم الملف:Link/Client:70',
    fm.full_name1 as 'الاسم',
    fm.age as 'العمر',
    fm.social_status1 as 'الحالة الاجتماعية'
    from tabClient c, `tabFamily Members` fm
    where c.name = fm.parent
    and gender1 = "Male"
    and fm.age > 18
    and fm.certificate1 = 0""", as_dict=1)


    bootinfo["charity"] = {
        "notification": [
            {
                "notification_title": "ملفات مضى عليها سنتين بدون تقديم",
                "notification_count": len(files_without_request),
                "notification_link": "/app/query-report/Files%20without%20request"},
            {
                "notification_title": "الايتام الذكور",
                "notification_count": len(male_orphans),
                "notification_link": "/app/query-report/Male%20Orphans"
            }
        ]
        }


    # startup messages

    # keep existing messages
    if "messages" in bootinfo and not isinstance(bootinfo["messages"], list):
        bootinfo["messages"] = [bootinfo["messages"]]
    bootinfo["messages"] = bootinfo.get("messages", [])
    return bootinfo
