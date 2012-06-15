(function () {
	"use strict";

	if (window.face === undefined) {
		window.face = {

			getUrlParam: function (param) {
				var vars = {};

				window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
					vars[key.toLowerCase()] = value;
				});

				return vars[param.toLowerCase()];
			}
		};
	}
} ());


window.backToNewGame = function (className) {
	"use strict";

	$(".page-container").toggleClass(className);

	$('#pageFrame').attr('src', 'about:blank');
};