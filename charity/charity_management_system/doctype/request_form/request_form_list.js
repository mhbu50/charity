frappe.listview_settings['Request Form'] = {
  onload: function(me) {
    console.log("in charity.request_form_list");
    if (frappe.user.has_role('Researcher')) {
      console.log("you are Researcher = ", frappe.session.user);
      frappe.route_options = {
        "Researcher table.email": frappe.session.user
      };
    }
  }
}