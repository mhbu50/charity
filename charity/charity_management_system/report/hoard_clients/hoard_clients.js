frappe.query_reports["Hoard Clients"] = {
	"filters": [
						{
												"fieldname":"end_date",
												"label": __("End Date"),
												"fieldtype": "Date",
												"default": frappe.datetime.get_today()
										},
	]
}
console.log("frappe",frappe);
