(function() {
function setErrorMessage(el, message) {
	$(el).data('errorMessage', message);
}

function getErrorMessage(el, message) {
	return $(el).data('errorMessage') || el.title;
}

function showErrorMessage(el) {
	var $el = $(el);
	var errorContainer = $el.siblings('.error.message');

	if (!errorContainer.length) {
		errorContainer = $('<span class="error message"></span>').insertAfter($el);
	}
	errorContainer.text(getErrorMessage(el));
}

function removeErrorMessage(el) {
	var errorContainer = $(el).siblings('.error.message');
	errorContainer.remove();
}

function validateEmail (el) {
	var email = document.getElementById('email');
	var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var valid = emailRegex.test(this.value);
	if (!valid) {
		setErrorMessage(el, 'Please enter a valid e-mail address.');
	}
	return valid;
};

function validatePassword () {
	var password = document.getElementById('password');
	var valid = password.value.length >= 8;
	if (!valid) {
		setErrorMessage(el, 'Your password must contain at least 8 characters.');
	}
	return valid;
};

$('#email').on('blur', validateEmail());
})