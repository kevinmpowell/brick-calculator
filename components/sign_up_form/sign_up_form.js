'use strict';
BC.SignUpForm = function() {
  const signUpFormId = 'bc-sign-up-form',
        emailFieldId = 'bc-sign-up-form-email',
        passwordFieldId = 'bc-sign-up-form-password',
        submitButtonSelector = '.bc-sign-up-form__submit-button';

  let form,
      emailField,
      passwordField,
      submitButton;

  function disableForm() {
    emailField.setAttribute('disabled', true);
    passwordField.setAttribute('disabled', true);
    submitButton.setAttribute('disabled', true);
  }

  function enableForm() {
    emailField.removeAttribute('disabled');
    passwordField.removeAttribute('disabled');
    submitButton.removeAttribute('disabled');
  }

  function resetForm() {
    form.reset();
  }

  function saveAuthToken(authToken) {
    localStorage.setItem('bcUserAuthToken', authToken)
  }

  function handleFormSignup(e) {
    e.preventDefault();
    disableForm();
    var request = new XMLHttpRequest();
    const apiDomain = apiMapping[currentDomain],
          params = "email=" + emailField.value + "&password=" + passwordField.value + "&password_confirmation=" + passwordField.value;
    request.open('POST', apiDomain + '/signup', true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //Send the proper header information along with the request for the POST to work
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        saveAuthToken(data.auth_token);
        BC.Overlay.show("Welcome!", "User account created successfully.", true);
        enableForm();
        resetForm();
      } else if (request.status === 422) {

        var data = JSON.parse(request.responseText);
        if (data.message && data.message.toLowerCase().includes('already exists')) {
          BC.Overlay.show("Sorry! Can't create that account.", data.message, true);
        } else if (data.message && data.message.toLowerCase().includes("password can't be blank")) {
          BC.Overlay.show("Forget something?", "Please enter a password", true);
        }
        // We reached our target server, but it returned an error
        enableForm();
      } else {
        alert("Sign up failed - connection successful, but data failed");
        enableForm();
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      alert("Could not sign up - connection error");
      enableForm();
    };

    request.send(params); // POST params are sent down here
    return false; // prevent form submission
  }

  function setEventListeners() {
    form.addEventListener("submit", handleFormSignup);
  }

  const initialize = function initialize() {
    form = document.getElementById(signUpFormId);
    emailField = document.getElementById(emailFieldId);
    passwordField = document.getElementById(passwordFieldId);
    submitButton = document.querySelector(submitButtonSelector);
    setEventListeners();
  }

  return {
    initialize: initialize
  }
}();
