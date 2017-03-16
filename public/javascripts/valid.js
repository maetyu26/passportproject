(function () {
  document.forms.register.noValidate = true;

  $('form').on('submit', function (e) {
    var elements = this.elements;
    var valid = {};
    var isValid;
    var isFormValid;

    var i;
    for (i = 0, l = elements.length; i < l; i++) {

      isValid = validateRequired(elements[i]) && validateTypes(elements[i]); 
      if (!isValid) {
        showErrorMessage(elements[i]);
      } else {
        removeErrorMessage(elements[i]);
      }
      valid[elements[i].id] = isValid;
    }

    if (!validateBio()) {
      showErrorMessage(document.getElementById('bio'));
      valid.bio = false;
    } else {
      removeErrorMessage(document.getElementById('bio'));
    }

    if (!validatePassword()) {
      showErrorMessage(document.getElementById('password'));
      valid.password = false;
    } else {
      removeErrorMessage(document.getElementById('password'));
    }

    if (!validateParentsConsent()) {
      showErrorMessage(document.getElementById('parents-consent'));
      valid.parentsConsent = false;
    } else {
      removeErrorMessage(document.getElementById('parents-consent'));
    }

    for (var field in valid) {
      if (!valid[field]) {
        isFormValid = false;
        break;
      }
      isFormValid = true;
    }

    if (!isFormValid) {
      e.preventDefault();
    }

  });

  function validateRequired(el) {
    if (isRequired(el)) {
      var valid = !isEmpty(el);
      if (!valid) {
        setErrorMessage(el,  'Field is required');
      }
      return valid;
    }
    return true;
  }

  function isRequired(el) {
   return ((typeof el.required === 'boolean') && el.required) ||
     (typeof el.required === 'string');
  }

  function isEmpty(el) {
    return !el.value || el.value === el.placeholder;
  }

  function validateTypes(el) {
    if (!el.value) return true;

    var type = $(el).data('type') || el.getAttribute('type');
    if (typeof validateType[type] === 'function') {
      return validateType[type](el);
    } else {
      return true;
    }
  }

  function validateParentsConsent() {
    var parentsConsent   = document.getElementById('parents-consent');
    var consentContainer = document.getElementById('consent-container');
    var valid = true;
    if (consentContainer.className.indexOf('hide') === -1) {
      valid = parentsConsent.checked;
      if (!valid) {
        setErrorMessage(parentsConsent, 'You need your parents\' consent');
      }
    }
    return valid;
  }

  function validateBio() {
    var bio = document.getElementById('bio');
    var valid = bio.value.length <= 140;
    if (!valid) {
      setErrorMessage(bio, 'Please make sure your bio does not exceed 140 characters');
    }
    return valid;
  }

  function validatePassword() {
    var password = document.getElementById('password');
    var valid = password.value.length >= 8;
    if (!valid) {
      setErrorMessage(password, 'Please make sure your password has at least 8 characters');
    }
    return valid;
  }

  function setErrorMessage(el, message) {
    $(el).data('errorMessage', message);
  }

  function getErrorMessage(el) {
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

  var validateType = {
    email: function (el) {

      var valid = /[^@]+@[^@]+/.test(el.value);
      if (!valid) {
        setErrorMessage(el, 'Please enter a valid email');
      }
      return valid;
    },
    number: function (el) {
      var valid = /^\d+$/.test(el.value);
      if (!valid) {
        setErrorMessage(el, 'Please enter a valid number');
      }
      return valid;
    },
    date: function (el) {

      var valid = /^(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})$/.test(el.value);
      if (!valid) {
        setErrorMessage(el, 'Please enter a valid date');
      }
      return valid;
    }
  };

}());