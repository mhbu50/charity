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

    def before_print(self):
        self.copy = 1
        # print "############## copy = {}".format(self.copy)

    def on_print(self):
        self.copy = 1
        # print "&&&&&&&&&&&&& copy = {}".format(self.copy)
