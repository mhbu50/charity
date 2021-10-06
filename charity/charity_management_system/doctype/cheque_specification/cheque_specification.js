// Copyright (c) 2017, Accurate Systems and contributors
// For license information, please see license.txt

frappe.ui.form.on('Cheque Specification', {
	refresh: function(frm) {
		if(frm.doc.__islocal){
			var today_date = frappe.datetime.nowdate();
			frm.set_value("h_date_of_issue",getHijriDate(today_date));
			frm.set_value("h_year",getHijriYear(today_date));
			frm.refresh_field("h_date_of_coupon");
			frm.refresh_field("h_year");
		}
	},
	date_of_issue: function(frm) {
		var date = frm.doc.date_of_issue;
		frm.set_value("h_date_of_issue",getHijriDate(date));
		frm.refresh_field("h_date_of_issue");
	},
	onload:function(frm) {
		if(frm.doc.delivered){
			cur_frm.fields.forEach(function(l){ 
			cur_frm.set_df_property(l.df.fieldname, "read_only", 1);
			 });
		}
	}
});
