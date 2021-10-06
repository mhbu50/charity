frappe.ui.form.on("Request Form", {
  onload: function(frm) {
    if (frm.doc.workflow_state == "Awaiting Researcher" || frm.doc.workflow_state == "Approved By Researcher") {
      if (!is_research(frm)) {
        // $(".actions-btn-group").remove();
        frm.disable_save();
        // frm.fields.forEach(function(l) {
        //   if (l.df.fieldname == "workflow_state") {
        //     continue;
        //   }
        //   frm.set_df_property(l.df.fieldname, "read_only", 1);
        // });
      }
    }
  },
  refresh: function(frm) {
    if (frm.doc.__islocal) {
      var today_date = frappe.datetime.nowdate();
      frm.set_value("h_date_of_request", getHijriDate(today_date));
      frm.set_value("h_year", getHijriYear(today_date));
      frm.refresh_field("h_date_of_request");
      frm.refresh_field("h_year");
    }

    if (frm.doc.read_only_sec) {
      let to_hide = ["request_number", "file_number", "date_of_request", "type_of_the_requested_aid",
        "date_of_marriage_contract", "current_available_amount", "terms_of_marriage", "amount_of_dowry",
        "requested_amount", "requirements", "broken_requirements", "school", "financial", "f_total",
        "medical_table", "m_total"
      ];

      to_hide.forEach(function(l) {
        frm.set_df_property(l, "read_only", 1);
      });

    } else if (!frm.doc.read_only_sec) {
      let to_hide = ["request_number", "file_number", "date_of_request", "type_of_the_requested_aid",
        "date_of_marriage_contract", "current_available_amount", "terms_of_marriage", "amount_of_dowry",
        "requested_amount", "requirements", "broken_requirements", "school", "financial", "f_total",
        "medical_table", "m_total"
      ];

      to_hide.forEach(function(l) {
        frm.set_df_property(l, "read_only", 0);
      });

    }
    // frm.add_custom_button(__("Coupon"), function() {
    //     frappe.model.open_mapped_doc({
    //         method: "charity.charity_management_system.tools.make_coupon",
    //         frm: cur_frm
    //     });
    // }, __("Make"));

    show_required_section(frm);
  },
  on_update: function(frm) {
    if (frappe.user_roles.indexOf("Researcher") != -1) {
      frm.set_value("date_of_research", frappe.utils.nowdate());
      frm.save();
    } else if (frm.doc.workflow_state == "Approved for Full Aid" ||
      frm.doc.workflow_state == "Approved for Cheques Only" ||
      frm.doc.workflow_state == "Approved For Coupons Only") {
      frm.set_value("date_of_meeting", frappe.utils.nowdate());
      frm.save();
    }
  },
  date_of_request: function(frm) {
    var date = frm.doc.date_of_request;
    frm.set_value("h_date_of_request", getHijriDate(date));
    frm.refresh_field("h_date_of_request");
  },
  date_of_marriage_contract: function(frm) {
    var date = frm.doc.date_of_marriage_contract;
    frm.set_value("h_date_of_marriage_contract", getHijriDate(date));
    frm.refresh_field("h_date_of_marriage_contract");
  },
  date_of_research: function(frm) {
    var date = frm.doc.date_of_research;
    frm.set_value("h_date_of_research", getHijriDate(date));
    frm.refresh_field("h_date_of_research");
  },
  date_of_meeting: function(frm) {
    var date = frm.doc.date_of_meeting;
    frm.set_value("h_date_of_meeting", getHijriDate(date));
    frm.refresh_field("h_date_of_meeting");
  },
  research_committee_received_date: function(frm) {
    var date = frm.doc.research_committee_received_date;
    frm.set_value("h_research_committee_received_date", getHijriDate(date));
    frm.refresh_field("h_research_committee_received_date");
  }
});


frappe.ui.form.on("Requested Aid", {
  request_type: function(frm) {
    show_required_section(frm);
  }
});


function show_required_section(frm) {
  $.each(frm.doc.type_of_the_requested_aid, function(key, value) {
    console.log(key, value.request_type);
    if (value.request_type == "زواج") {
      frm.toggle_display("section_break1", true);
    }

    if (value.request_type == "أجهزة / أثاث") {
      frm.toggle_display("section_break0", true);
    }

    if (value.request_type == "مصروفات مدرسية") {
      frm.toggle_display("school_expenses", true);
    }
    if (value.request_type == "مصروفات مالية") {
      frm.toggle_display("financial_expenses", true);
    }

    if (value.request_type == "دفع الديون") {
      frm.toggle_display("debts", true);
    }
    if (value.request_type == "صحية") {
      frm.toggle_display("medical_condition", true);
    }

  });
}

function is_research(frm) {
  var flag = false;
  frm.doc.researcher.forEach(function(d) {
    if (d.email == frappe.session.user || frappe.user.has_role('System Manager') || frappe.user.has_role('Client Relations')) {
      flag = true;
    }
  });

  frm.doc.research_committee_table.forEach(function(d) {
    if (d.email == frappe.session.user || frappe.user.has_role('System Manager')) {
      flag = true;
    }
  });
  return flag;
}

frappe.ui.form.on("Financial table", {
  amount: function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    var total = 0;
    frm.doc.financial.forEach(function(d) {
      total += d.amount;
    });

    frm.set_value("f_total", total);
    frm.refresh_field("f_total");

  }
});

frappe.ui.form.on("Medical table", {
  amount: function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    var total = 0;
    frm.doc.medical_table.forEach(function(d) {
      total += d.amount;
    });

    frm.set_value("m_total", total);
    frm.refresh_field("m_total");
  },
  date_of_birth: function(frm) {
    var date = frm.doc.date_of_birth;
    frm.set_value("h_date_of_birth", getHijriDate(date));
    frm.refresh_field("h_date_of_birth");
  }
});

frappe.ui.form.on("Unincluded Dependent", {
  date_of_birth: function(frm) {
    var date = frm.doc.date_of_birth;
    frm.set_value("h_date_of_birth", getHijriDate(date));
    frm.refresh_field("h_date_of_birth");
  }
});

frappe.ui.form.on("Family Members", {
  date_of_birth: function(frm) {
    var date = frm.doc.date_of_birth;
    frm.set_value("h_date_of_birth", getHijriDate(date));
    frm.refresh_field("h_date_of_birth");
  }
});

frappe.ui.form.on("Coupon", {
  recommendation_table_add: function(frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    frappe.model.set_value(row.doctype, row.name, 'file_number', frm.doc.file_number);
    frappe.model.set_value(row.doctype, row.name, 'request_number', frm.doc.name);
    var today_date = frappe.datetime.nowdate();
    frappe.model.set_value(row.doctype, row.name, "h_date_of_coupon", getHijriDate(today_date));
    frappe.model.set_value(row.doctype, row.name, "full_name", frm.doc.full_name);
    frappe.model.set_value(row.doctype, row.name, 'mobile_number', frm.doc.mobile_number);
  },
  date_of_birth: function(frm) {
    var date = frm.doc.date_of_birth;
    frm.set_value("h_date_of_birth", getHijriDate(date));
    frm.refresh_field("h_date_of_birth");
  },
  quantity: function(frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    frappe.model.set_value(row.doctype, row.name, "total", row.rate * row.quantity);
    frm.refresh_field("total");
  },
  onload: function(frm, cdt, cdn) {
    if (frm.doc.delivered) {
      cur_frm.fields.forEach(function(l) {
        cur_frm.set_df_property(l.df.fieldname, "read_only", 1);
      });
    }
  }
});

frappe.ui.form.on("Cheque Specification", {
  cheque_add: function(frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    frappe.model.set_value(row.doctype, row.name, 'file_number', frm.doc.file_number);
    frappe.model.set_value(row.doctype, row.name, 'request_number', frm.doc.name);
    var today_date = frappe.datetime.nowdate();
    frappe.model.set_value(row.doctype, row.name, "h_date_of_issue", getHijriDate(today_date));
    frappe.model.set_value(row.doctype, row.name, "name_of_client", frm.doc.full_name);
    frappe.model.set_value(row.doctype, row.name, 'mobile_number', frm.doc.mobile_number);
    frappe.model.set_value(row.doctype, row.name, 'city', frm.doc.city);
  }
});

cur_frm.fields_dict["recommendation_table"].grid.get_field("item").get_query = function(frm, cdt, cdn) {
  var d = locals[cdt][cdn];
  console.log("d", d);
  return {
    filters: {
      package_type: d.package_type
    }
  }
}