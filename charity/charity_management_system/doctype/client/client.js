// Copyright (c) 2017, Accurate Systems and contributors
// For license information, please see license.txt

frappe.ui.form.on('Client', {
	onload: function(frm) {
		if(frm.doc.date_of_birth){
			console.log("frm.doc.date_of_birth",frm.doc.date_of_birth);
			console.log("getAge(frm.doc.date_of_birth) =",getAge(frm.doc.date_of_birth));
			frm.set_value("age",getAge(frm.doc.date_of_birth));
			frm.refresh_field("age");
		}
		frm.set_value("the_joining_period",parseInt(frappe.datetime.get_day_diff(frappe.datetime.nowdate(), frm.doc.date_of_joining ) /365));
		frm.refresh_field("the_joining_period");
		if(frm.doc.family_tree){
		frm.doc.family_tree.forEach(function(d) {
			frappe.model.set_value(d.doctype, d.name, "age", getAge(d.date_of_birth));
		 });
	 }
	 	 if(frm.doc.family_members_not_included){
		 frm.doc.family_members_not_included.forEach(function(d) {
 			frappe.model.set_value(d.doctype, d.name, "age", getAge(d.date_of_birth));
 		 });
	 }
		 //this check is not working
		 if(frm.doc.__unsaved){
			 frm.save();
		 }
	},
	date_of_joining: function(frm) {
		var date = frm.doc.date_of_joining;
		frm.set_value("h_date_of_joining",getHijriDate(date));
		frm.refresh_field("h_date_of_joining");

		frm.set_value("age",getAge(frm.doc.date_of_birth));
		frm.refresh_field("age");
	},
	date_of_birth: function(frm) {
		var date = frm.doc.date_of_birth;
		frm.set_value("h_date_of_birth",getHijriDate(date));
		frm.refresh_field("h_date_of_birth");

	},
	yearly_rent: function (frm) {
		frm.set_value("six_months_rent",frm.doc.yearly_rent /2);
		frm.set_value("three_months_rent",frm.doc.yearly_rent /4);
		frm.set_value("one_month_rent",frm.doc.yearly_rent /12);
	},

	mobile_no:function(frm) {
		if(frm.doc.mobile_no.length < 10){
			frappe.throw(__("The nubmer is incomplete, you have to enter 10 digit"));
			return false;
		}
	},
	second_mobile_no:function(frm) {
		if(frm.doc.second_mobile_no.length < 10){
			frappe.throw(__("The nubmer is incomplete, you have to enter 10 digit"));
			return false;
		}
	},
	thrid_mobile_no:function(frm) {
		if(frm.doc.thrid_mobile_no.length < 10){
			frappe.throw(__("The nubmer is incomplete, you have to enter 10 digit"));
			return false;
		}
	},
	work_telephone_no:function(frm) {
		if(frm.doc.work_telephone_no.length < 10){
			frappe.throw(__("The nubmer is incomplete, you have to enter 10 digit"));
			return false;
		}
	},
	move1:function(frm) {
		debugger;
		$.each(frm.doc.family_tree,function(index,row) {
			if(row.__checked){
				var new_row = frm.add_child("family_members_not_included");
                new_row.full_name2 = row.full_name1;
                new_row.date_of_birth2 = row.date_of_birth1;
                new_row.h_date_of_birth2 = row.h_date_of_birth1;
                new_row.place_of_birth2 = row.place_of_birth1;
								new_row.health_status2 = row.health_status1;
								new_row.age2 = row.age;
								new_row.national_id2 = row.national_id1;
								new_row.relation_to_the_client2 = row.relation_to_the_client1;
								new_row.social_status2 = row.social_status1;
								new_row.education_level2 = row.education_level1;
								new_row.notes2 = row.notes1;

								new_row.semester_grade_percentage2 = row.semester_grade_percentage1;
								new_row.evaluation2 = row.evaluation1;
								new_row.date_of_grade2 = row.date_of_grade1;
				frm.get_field("family_tree").grid.grid_rows[row.idx-1].remove();
			}
		});
		 refresh_field("family_members_not_included");

		 frappe.call({
			 "method": "frappe.client.get_value",
			 args: {
				 doctype: "Amount For Families",
 				fieldname: "amount",
				 filters: {
					 "family_count": frm.doc.total
				 },
			 },
			 callback: function(data) {
				 if (data.message) {
					 frm.set_value("amount_for_family", data.message.amount);
					 frm.refresh_field("amount_for_family");
				 }
			 }
		 });
	},
	move2:function(frm) {
		$.each(frm.doc.family_members_not_included,function(index,row) {
			if(row.__checked){
				var new_row = frm.add_child("family_tree");
								new_row.full_name1 = row.full_name2;
								new_row.date_of_birth1 = row.date_of_birth2;
								new_row.h_date_of_birth1 = row.h_date_of_birth2;
								new_row.place_of_birth1 = row.place_of_birth2;
								new_row.health_status1 = row.health_status2;
								new_row.age1 = row.age2;
								new_row.national_id1 = row.national_id2;
								new_row.relation_to_the_client1 = row.relation_to_the_client2;
								new_row.social_status1 = row.social_status2;
								new_row.education_level1 = row.education_level2;
								new_row.notes1 = row.notes2;

								new_row.semester_grade_percentage1 = row.semester_grade_percentage2;
								new_row.evaluation1 = row.evaluation2;
								new_row.date_of_grade1 = row.date_of_grade2;
				frm.get_field("family_members_not_included").grid.grid_rows[row.idx-1].remove();
			}
		});
		 refresh_field("family_tree");

		 var total = 1;
 		frm.doc.family_tree.forEach(function(d) {
 				total += 1;
 		});

 		frm.set_value("total",total);
 		frm.refresh_field("total");

		frappe.call({
			"method": "frappe.client.get_value",
			args: {
				doctype: "Amount For Families",
				fieldname: "amount",
				filters: {
					"family_count": total
				},
			},
			callback: function(data) {
				if (data.message) {
					frm.set_value("amount_for_family", data.message.amount);
					frm.refresh_field("amount_for_family");
				}
			}
		});
	},

});
frappe.ui.form.on('Family Members', {
	date_of_birth1: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var date = row.date_of_birth1;
		frappe.model.set_value(row.doctype, row.name, "h_date_of_birth1",getHijriDate(date));
		frm.refresh_field("h_date_of_birth1");

		frappe.model.set_value(row.doctype, row.name, "age", getAge(date));
		frm.refresh_field("age");
	},
	national_id1:function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if(row.national_id.length < 10){
			frappe.throw(__("The nubmer is incomplete, you have to enter 10 digit"));
			return false;
		}
	},
	family_tree_add:function(frm){
		// frm.trigger("calculate_members");
		var total = 1;
		frm.doc.family_tree.forEach(function(d) {
				total += 1;
		});

		frm.set_value("total",total);
		frm.refresh_field("total");

		frappe.call({
			"method": "frappe.client.get_value",
			args: {
				doctype: "Amount For Families",
				fieldname: "amount",
				filters: {
					"family_count": total
				},
			},
			callback: function(data) {
				if (data.message) {
					frm.set_value("amount_for_family", data.message.amount);
					frm.refresh_field("amount_for_family");
				}
			}
		});
	},
	orphan_amount: function(frm, cdt, cdn) {
		var orphan = 0;
		frm.doc.family_tree.forEach(function(d) {
			orphan += d.orphan_amount;
		});
		
		frm.set_value("orphan_total", orphan);
		frm.refresh_field("orphan_total");

		frm.set_value("amount_total", orphan + frm.doc.help_amount);
        frm.refresh_field("amount_total");
	},
	family_tree_remove:function(frm){
		// frm.trigger("calculate_members");
		var total = 1;
		frm.doc.family_tree.forEach(function(d) {
				total += 1;
		});

		frm.set_value("total",total);
		frm.refresh_field("total");

		frappe.call({
			"method": "frappe.client.get_value",
			args: {
				doctype: "Amount For Families",
				fieldname: "amount",
				filters: {
					"family_count": total
				},
			},
			callback: function(data) {
				if (data.message) {
					frm.set_value("amount_for_family", data.message.amount);
					frm.refresh_field("amount_for_family");
				}
			}
		});
		var orphan = 0;
			frm.doc.family_tree.forEach(function(d) {
				orphan += d.orphan_amount;
			});
			debugger;
	
			frm.set_value("orphan_total", orphan);
			frm.refresh_field("orphan_total");

			frm.set_value("amount_total", orphan + frm.doc.help_amount);
			frm.refresh_field("amount_total");
	},
	gender1:function (frm, cdt, cdn){
		var row = locals[cdt][cdn];
		frappe.call({
			"method": "frappe.client.get",
			args: {
				doctype: "Education Status",
        name: row.education_level1
			},
			callback: function(data) {
				if (data.message) {
					console.log("data.message",data.message);
					if(row.gender1 == "Male"){
						frappe.model.set_value(row.doctype, row.name,"grade1", data.message.boy_grade);
						frappe.model.set_value(row.doctype, row.name,"clothing1", data.message.boy_clothing);
					}else{
						frappe.model.set_value(row.doctype, row.name,"grade1", data.message.girl_grade);
						frappe.model.set_value(row.doctype, row.name,"clothing1", data.message.girl_clothing);
					}
					refresh_field("grade1");
					refresh_field("clothing1");
				}
			}
			});
		}
		// orphan_amount: function(frm, cdt, cdn) {
		// 	var orphan = 0;
		// 	frm.doc.family_tree.forEach(function(d) {
		// 		orphan += d.orphan_amount;
		// 	});
			
		// 	frm.set_value("orphan_total", orphan);
		// 	frm.refresh_field("orphan_total");
		// }
		// family_tree_remove:function(frm){
		// 	var orphan = 0;
		// 	frm.doc.family_tree.forEach(function(d) {
		// 		orphan += d.orphan_amount;
		// 	});
		// 	debugger;
	
		// 	frm.set_value("orphan_total", orphan);
		// 	frm.refresh_field("orphan_total");
		// }
});


frappe.ui.form.on('Unincluded Dependent', {
	date_of_birth2: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var date = row.date_of_birth2;
		frappe.model.set_value(row.doctype, row.name, "h_date_of_birth2",getHijriDate(date));
		frm.refresh_field("h_date_of_birth2");

		frappe.model.set_value(row.doctype, row.name, "age2", getAge(date));
		frm.refresh_field("age2");

},
national_id2:function(frm, cdt, cdn) {
	var row = locals[cdt][cdn];
	if(row.national_id.length < 10){
		frappe.throw(__("The nubmer is incomplete, you have to enter 10 digit"));
		return false;
	}
}
});

frappe.ui.form.on('Client Debt', {
	deadline: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var date = row.deadline;
		frappe.model.set_value(row.doctype, row.name, "h_deadline",getHijriDate(date));
		frm.refresh_field("h_deadline");
	},
	monthly_installment: function(frm, cdt, cdn) {
        var install = 0;
        frm.doc.debts.forEach(function(d) {
            install += d.monthly_installment;
		});
		
		frm.set_value("total_monthly_installment", install);
		frm.refresh_field("total_monthly_installment");
	},
	debts_remove:function(frm){
		var install = 0;
        frm.doc.debts.forEach(function(d) {
            install += d.monthly_installment;
		});
		debugger;

		frm.set_value("total_monthly_installment", install);
		frm.refresh_field("total_monthly_installment");
	}
});

frappe.ui.form.on("Offered Help", {
    amount: function(frm, cdt, cdn) {
        var total = 0;
        frm.doc.offered_help.forEach(function(d) {
            total += d.amount;
        });
        frm.set_value("total_amount", total);
        frm.refresh_field("total_amount");
    },
	offered_help_remove:function(frm){
		var total = 0;
        frm.doc.offered_help.forEach(function(d) {
            install += d.amount;
		});
		debugger;

		frm.set_value("total_amount", total);
		frm.refresh_field("total_amount");
	}
});

frappe.ui.form.on('Dependent worker', {
national_id:function(frm, cdt, cdn) {
	var row = locals[cdt][cdn];
	if(row.national_id.length < 10){
		frappe.throw(__("The nubmer is incomplete, you have to enter 10 digit"));
		return false;
	}
}
});

frappe.ui.form.on("Job", {
    salary: function(frm, cdt, cdn) {
        var total = 0;
        frm.doc.jobs.forEach(function(d) {
            total += d.salary;
        });

        frm.set_value("total_monthly_income", total);
        frm.refresh_field("total_monthly_income");

		frm.set_value("average_monthly_income", (total - frm.doc.total_monthly_installment - frm.doc.one_month_rent)/frm.doc.total);
		// frm.set_value("average_monthly_income", total / frm.doc.jobs.length);
        frm.refresh_field("average_monthly_income");
	},
	jobs_remove:function(frm){
		var total = 0;
		frm.doc.jobs.forEach(function(d) {
					total += d.salary;
		});
		debugger;

		frm.set_value("total_monthly_income", total);
		frm.refresh_field("total_monthly_income");

		frm.set_value("average_monthly_income", (total - frm.doc.total_monthly_installment - frm.doc.one_month_rent)/frm.doc.total);
		// frm.set_value("average_monthly_income", total / frm.doc.jobs.length);
		frm.refresh_field("average_monthly_income");
	}
});
