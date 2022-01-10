# -*- coding: utf-8 -*-
# Copyright (c) 2017, Accurate Systems and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

# from umalqurra.hijri_date import HijriDate


class ChequeSpecification(Document):

    def before_insert(self):
        self.parent = self.file_number
        self.parentfield = 'cheque'
        self.parenttype = 'client'
    
    def on_submit(self):
        client = frappe.get_doc("Client",self.file_number)
        offered_help = client.offered_help
        offered_help.append({"received_aid_for_client": "{} : {}".format(self.research_decision,self.cheque_status),"amount":self.cheque_amount ,"received_date":self.date_of_issue,"cheque_specification":self.name})
        client.set("offered_help",offered_help)
        total = 0
        for c in offered_help:
            total = total + c.get("amount")
        client.set("total_amount",total)
        client.save(ignore_permissions=True)
