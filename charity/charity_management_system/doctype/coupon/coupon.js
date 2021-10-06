// Copyright (c) 2017, Accurate Systems and contributors
// For license information, please see license.txt

frappe.ui.form.on('Coupon', {
	onload:function(frm){
		$(".btn-print-print").click(function () {
				console.log("parseInt(frm.doc.copy) = ",parseInt(frm.doc.copy));
			 var copy  = parseInt(frm.doc.copy)+1;
			 console.log("copy = ",copy);
			 frm.set_value("copy",copy);
			 frm.save();
		});
		cur_frm.set_query("item", function() {
        return {
            // "filters": {
            //     package_type: frm.doc.package_type
			// }
			filters: [
			 			['package_type', '=', frm.doc.package_type]
			 		]
        };
    });
	},
	refresh: function(frm) {
		if(frm.doc.__islocal){
			var today_date = frappe.datetime.nowdate();
			frm.set_value("h_date_of_coupon",getHijriDate(today_date));
			frm.set_value("h_year",getHijriYear(today_date));
			frm.refresh_field("h_date_of_coupon");
			frm.refresh_field("h_year");
		}
	},
	date_of_coupon: function(frm) {
		var date = frm.doc.date_of_coupon;
		frm.set_value("h_date_of_coupon",getHijriDate(date));
		frm.refresh_field("h_date_of_coupon");
	},item: function(frm) {
		frm.set_value("total",frm.doc.rate * frm.doc.quantity);
		frm.refresh_field("total");
	},
	quantity: function(frm) {
		frm.set_value("total",frm.doc.rate * frm.doc.quantity);
		frm.refresh_field("total");
	},
	onload:function(frm) {
		if(frm.doc.delivered){
			cur_frm.fields.forEach(function(l){ 
			cur_frm.set_df_property(l.df.fieldname, "read_only", 1);
			 });
		}
	}
});
