'use strict';
BC.SignInForm = function() {
  const signInFormId = 'bc-sign-in-form',
        emailFieldId = 'bc-sign-in-form-email',
        passwordFieldId = 'bc-sign-in-form-password',
        submitButtonSelector = '.bc-sign-in-form__submit-button',
        signInEndpoint = '/auth/signin',
        signInFormHiddenClass = 'bc-sign-in-form--hidden',
        signUpLinkSelector = '.bc-show-sign-up-form';

  let form,
      emailField,
      passwordField,
      submitButton,
      signUpLink;

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
    document.activeElement.blur();
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
        var decodedData = JSON.parse(BC.Utils.stringDecoder(request.responseText));
        BC.Utils.saveToLocalStorage(localStorageKeys.authToken, decodedData.auth_token);
        BC.Utils.saveToLocalStorage(localStorageKeys.userSettings, request.responseText);
        // TODO: Broadcast event that user settings have been loaded
        BC.ToastMessage.create("Signed in. Welcome back.", "success");

        BC.App.setSignedInState();
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

  function hideSignInForm() {
    form.classList.add(signInFormHiddenClass);
  }

  function showSignInForm() {
    form.classList.remove(signInFormHiddenClass);
  }

  function setEventListeners() {
    form.addEventListener("submit", handleFormSignIn);
    signUpLink.addEventListener("click", BC.SignUpForm.showFormPane);
    document.addEventListener(customEvents.userSignedIn, hideSignInForm);
    document.addEventListener(customEvents.userSignedOut, showSignInForm);
  }

  const initialize = function initialize() {
    form = document.getElementById(signInFormId);
    emailField = document.getElementById(emailFieldId);
    passwordField = document.getElementById(passwordFieldId);
    submitButton = document.querySelector(submitButtonSelector);
    signUpLink = document.querySelector(signUpLinkSelector);
    setEventListeners();
  }

  return {
    initialize: initialize
  }
}();
