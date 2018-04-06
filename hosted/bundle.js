"use strict";

var handleIndustry = function handleIndustry(e) {
	e.preventDefault();

	$("#industryMessage").animate({ width: 'hide' }, 350);

	if ($("#industryName").val() == '') {
		handleError("RAWR! All fields are required");
		return false;
	}

	sendAjax('POST', $("#industryForm").attr("action"), $("#industryForm").serialize(), function () {
		loadIndustriesFromServer();
	});

	return false;
};

var IndustryForm = function IndustryForm(props) {
	return React.createElement(
		"form",
		{ id: "industryForm",
			onSubmit: handleIndustry,
			name: "industryForm",
			action: "/maker",
			method: "POST",
			className: "industryForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "name" },
			"Name: "
		),
		React.createElement("input", { id: "industryName", type: "text", name: "name", placeholder: "Industry Name" }),
		React.createElement(
		"select", 
		{ id: "industryProduction"
		},
			React.createElement("option", {value: "Wood"}, "Wood"),
			React.createElement("option", {value: "Steel"}, "Steel"),
			React.createElement("option", {value: "Power"}, "Power")
		),
		React.createElement(
			"label",
			{ htmlFor: "production" },
			"Production: "
		),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "makeIndustrySubmit", type: "submit", value: "Make Industry" })
	);
};

var IndustryList = function IndustryList(props) {
	if (props.industries.length === 0) {
		return React.createElement(
			"div",
			{ className: "industryList" },
			React.createElement(
				"h3",
				{ className: "emptyIndustry" },
				"No Industries yet"
			)
		);
	}
	//#603912
	var industryNodes = props.industries.map(function (industry) {
		return React.createElement(
			"div",
			{ key: industry._id, className: "industry", style: { backgroundColor: industry.color } },
			React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "industry face", className: "industryFace" }),
			React.createElement(
				"h3",
				{ className: "industryName" },
				" Name: ",
				industry.name,
				" "
			),
			"//",
		);
	});

	return React.createElement(
		"div",
		{ className: "industrylist" },
		industryNodes
	);
};

var loadIndustriesFromServer = function loadIndustriesFromServer() {
	sendAjax('GET', '/getIndustries', null, function (data) {
		ReactDOM.render(React.createElement(IndustryList, { industries: data.industries }), document.querySelector("#industries"));
	});
};

var setup = function setup(csrf) {
	ReactDOM.render(React.createElement(IndustryForm, { csrf: csrf }), document.querySelector("#makeIndustry"));

	ReactDOM.render(React.createElement(IndustryList, { industries: [] }), document.querySelector("#industries"));

	loadIndustriesFromServer();
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
