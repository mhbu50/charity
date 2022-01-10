# -*- coding: utf-8 -*-
# Copyright (c) 2017, Accurate Systems and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document

class Client(Document):
	def validate(self):

		# print "client = {}).format(frappe.as_json(client))
		if len(self.national_id) < 10:
			frappe.throw(_("The nubmer is incomplete, you have to enter 10 digit"))
	
	def before_insert(self):
		client = frappe.get_list("Client",
		fields=["national_id"],
		filters= {"national_id":self.national_id},
		as_list=True)
		if len(client) > 0:
			frappe.throw(_("The client already have a file"))
