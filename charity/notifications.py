# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe


def get_notification_config():
    notifications = {
        "for_doctype": {
            "Request Form": {
                "workflow_state":
                ("in", ("Review Request", "Awaiting Researcher",
                        "Approved By Researcher", "Approved For Coupons Only",
                        "Approved for Cheques Only",
                        "Approved for Marked Fields", "Approved for Full Aid"))
            },
            "Coupons": {
                "status": ("in", ("Open", "Overdue"))
            },
            "Cheques": {
                "status": "Open"
            },
        }
    }

    doctype = [d for d in notifications.get('for_doctype')]
    for doc in frappe.get_all(
            'DocType',
            fields=["name"],
            filters={"name": ("not in", doctype),
                     'is_submittable': 1}):
        notifications["for_doctype"][doc.name] = {"docstatus": 0}

    return notifications
