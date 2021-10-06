# Copyright (c) 2013, Accurate Systems and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.utils import date_diff


def execute(filters=None):
    columns = [{
        "fieldname": "client",
        "label": _("File Number"),
        "fieldtype": "Link",
        "options": "Client",
        "width": 100
    }, {
        "fieldname": "name",
        "label": _("Name"),
        "fieldtype": "Data",
        "width": 200
    }, {
        "fieldname": "type",
        "label": _("Type"),
        "fieldtype": "Data",
        "width": 100
    }, {
        "fieldname": "item",
        "label": _("Item"),
        "fieldtype": "Data",
        "width": 100
    }, {
        "fieldname": "quantity",
        "label": _("Quantity"),
        "fieldtype": "Data",
        "width": 70
    }, {
        "fieldname": "amount",
        "label": _("Amount"),
        "fieldtype": "Data",
        "width": 70
    }, {
        "fieldname": "notes",
        "label": _("Note"),
        "fieldtype": "Data",
        "width": 200
    }]

    data = get_project(filters)
    return columns, data


def get_project(filters):
    val = {}
    out = []
    client_list = []
    coupon_list = []
    Cheque_list = []

    client_list = frappe.get_list(
        "Client", fields=["name,full_name"], order_by='name')

    for client in client_list:

        coupon_list = frappe.get_list(
            "Coupon",
            filters=[["date_of_coupon", ">=", filters.get("from")],
                     ["date_of_coupon", "<=", filters.get("to")],
                     ["file_number", "=", client.name]],
            fields=["date_of_coupon,item,quantity,rate,notes"],
            order_by='name')
        for cl in coupon_list:
            val = dict({
                "client": client.name,
                "name": client.full_name,
                "type": _("Coupon"),
                "date_of_coupon": cl.date_of_coupon,
                "item": cl.item,
                "quantity": cl.quantity,
                "amount": cl.quantity * cl.rate,
                "notes": cl.notes
            })
            out.append(val)

        Cheque_list = frappe.get_list(
            "Cheque Specification",
            filters=[["date_of_issue", ">=", filters.get("from")],
                     ["date_of_issue", "<=", filters.get("to")],
                     ["file_number", "=", client.name]],
            fields=["date_of_issue,research_decision,cheque_amount,notes"],
            order_by='name')
        for cs in Cheque_list:
            val = dict({
                "client": client.name,
                "name": client.full_name,
                "type": _("Cheque"),
                "date_of_issue": cs.date_of_issue,
                "research_decision": cs.research_decision,
                "amount": cs.cheque_amount,
                "notes": cs.notes
            })
            print "val = {}".format(val)
            # out.append(val)
        # print "////////////////// out = {}".format(out)
    return out
