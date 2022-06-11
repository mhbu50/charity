$(document).on('startup', function () {
	// on startup
	if (!frappe.boot.charity || frappe.get_route()[0] != "")
		return;
	console.log("frappe.boot.charity.notification :", frappe.boot.charity.notification);
	var rows = ""

	frappe.boot.charity.notification.forEach(row => {
		console.log("rows",rows);
		rows = rows + "<tr>"
			+ "<td>" + "<a href='"+ row.notification_link+"' target='_blank'>"+ row.notification_title+"</a>  " + "</td>"
			+ "<td>" + row.notification_count + "</td>"
			+ "</tr>"
	});
	console.log("file html:",rows);

	var $wrapper = frappe.msgprint("<table class='table table-striped table-hover'>"
		+ "<thead>"
		+ "<tr>"
		+ "<th>" + __("التقرير") + "</th>"
		+ "<th>" + __("العدد") + "</th>"

		+ "</tr>"
		+ "</thead>"
		+ "<tbody>"
		+ rows
		+ "</tbody>"
		+ "</table>"
		+ "<hr>"
		, "تنبيهات الجمعية").$wrapper;
	$wrapper.find("a").on("click", function () {
		frappe.set_route("Form", $(this).data("parenttype"), $(this).data("parent"));
	})

	// show only once
	//frappe.boot.consoleerp.expiring_documents = null;
}
);