"use strict";

var changePassword = function changePassword(e) {
	e.preventDefault();

	if ($("#pass3").val() != $("#pass4").val()) {
		handleError("Passwords do not match!");
		return false;
	}

	if ($("#pass3").val() == "" || $("#pass4").val() == "") {
		handleError("All fields are required!");
		return false;
	}

	sendAjax('POST', $("#passForm").attr("action"), $("#passForm").serialize(), function () {
		console.log("Changed!");
	});
	return false;
};

var PasswordForm = function PasswordForm(props) {
	return React.createElement(
		"form",
		{ id: "passForm",
			onSubmit: changePassword,
			name: "passForm",
			action: "/changePassword",
			method: "POST",
			className: "changeForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "pass3" },
			"New Password: "
		),
		React.createElement("input", { id: "pass3", type: "password", name: "pass3", placeholder: "new password" }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement(
			"label",
			{ htmlFor: "pass4" },
			"Re-type Password: "
		),
		React.createElement("input", { id: "pass4", type: "password", name: "pass4", placeholder: "re-type password" }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" })
	);
};

var setup = function setup(csrf) {
	ReactDOM.render(React.createElement(PasswordForm, { csrf: csrf }), document.querySelector("#content"));
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
"use strict";

var handleError = function handleError(message) {
	$("#errorMessage").text(message);
	$("#industryMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
	$("#industryMessage").animate({ width: 'hide' }, 350);
	window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function error(xhr, status, _error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};
