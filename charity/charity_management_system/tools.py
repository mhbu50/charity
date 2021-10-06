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
                "name":"request_number"
            }
        }
    }, target_doc, set_missing_values)
    return target_doc


def stop_hoard():
    clients = frappe.get_list("Client",filters={"joining_type":("in" ,['شامل مؤقت','مؤونة'])},fields=["*"])

    for client in clients:
        # print "utils.today() = {} client.end_date = {}".format(type(utils.today()),type(client.end_date))
        if str(client.end_date) == str(utils.today()):
            frappe.set_value('Client', client.name, 'joining_type',"موقوف")
