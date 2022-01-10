# -*- coding: utf-8 -*-
# Copyright (c) 2017, Accurate Systems and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.model.naming import make_autoname
# from umalqurra.hijri_date import HijriDate


class Coupon(Document):

    def before_insert(self):
        # print "#####################################"
        self.parent = self.file_number
        self.parentfield = 'coupon'
        self.parenttype = 'client'

    def after_insert(self):
        client = frappe.get_doc("Client",self.file_number)
        coupons = client.offered_help
        coupons.append({"received_aid_for_client": "{} : {}".format(self.item,self.quantity),"amount":self.total ,"received_date":self.date_of_coupon,"coupon":self.name})
        client.set("offered_help",coupons)
        total = 0
        for c in coupons:
            print("c:{}".format(frappe.as_json(c)))
            total = total + c.get("amount")
        client.set("total_amount",total)
        client.save(ignore_permissions=True)



    def before_print(self):
        self.copy = 1
        # print "############## copy = {}".format(self.copy)

    def on_print(self):
        self.copy = 1
        # print "&&&&&&&&&&&&& copy = {}".format(self.copy)
