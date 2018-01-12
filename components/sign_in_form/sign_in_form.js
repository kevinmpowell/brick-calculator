'use strict';
BC.SignInForm = function() {
  const signInFormId = 'bc-sign-in-form',
        emailFieldId = 'bc-sign-in-form-email',
        passwordFieldId = 'bc-sign-in-form-password',
        submitButtonSelector = '.bc-sign-in-form__submit-button',
        signInEndpoint = '/auth/signin',
        signInFormHiddenClass = 'bc-sign-in-form--hidden';

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

  function handleFormSignIn(e) {
    e.preventDefault();
    disableForm();
    var request = new XMLHttpRequest();
    const apiDomain = apiMapping[currentDomain],
          params = "email=" + emailField.value + "&password=" + passwordField.value,
          endpointUrl = apiDomain + signInEndpoint;
    request.open('POST', endpointUrl, true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //Send the proper header information along with the request for the POST to work
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function() {
      console.log(request);
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        BC.Utils.saveToLocalStorage(authTokenKeyName, data.auth_token);
        BC.Utils.saveToLocalStorage(userSettingsKeyName, data.preferences);
        // TODO: Broadcast event that user settings have been loaded
        BC.Overlay.show("Welcome back!", "Sign in successful.", true);
        setSignedInState();
        enableForm();
        resetForm();
      } else {
        var data = JSON.parse(request.responseText);
        BC.Overlay.show("Sign In Failed", data.message, true);
        enableForm();
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      BC.Overlay.show("Sign In Failed", "Something happened and we couldn't connect to sign you in. Sit tight, we'll fix it.", true);
      enableForm();
    };

    request.send(params); // POST params are sent down here
    return false; // prevent form submission
  }

  function setEventListeners() {
    form.addEventListener("submit", handleFormSignIn);
    // document.getElementById('submit-button').addEventListener("click", handleFormSignIn);
  }

  function hideSignInForm() {
    form.classList.add(signInFormHiddenClass);
  }

  const setSignedInState = function setSignedInState() {
    BC.Utils.validateAuthToken().then(function(){
      hideSignInForm();
      // TODO: Broadcast that user is signed in, do stuff with preferences, enable plus features, etc.
    }, function() {
      BC.Overlay.show("Not currently signed in", "This is an annoying message and should not be shown on page load.", true);
    }
    );
  }

  const initialize = function initialize() {
    form = document.getElementById(signInFormId);
    emailField = document.getElementById(emailFieldId);
    passwordField = document.getElementById(passwordFieldId);
    submitButton = document.querySelector(submitButtonSelector);
    setSignedInState();
    setEventListeners();
  }

  return {
    initialize: initialize,
    setSignedInState: setSignedInState,
  }
}();
