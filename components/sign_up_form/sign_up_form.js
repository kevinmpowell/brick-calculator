/* globals BC localStorageKeys apiMapping currentDomain Stripe */

'use strict';
BC.SignUpForm = function() {
  const signUpFormId = 'bc-sign-up-form',
        submitButtonSelector = '.bc-sign-up-form__submit-button',
        signUpEndpoint = '/signup',
        formPaneSelector = '.bc-sign-up-form-pane',
        formVisibleClass = 'bc-sign-up-form-pane--visible',
        hidePaneTriggerSelector = '.bc-sign-up-form-pane-hide-trigger';

  let form,
      formPane,
      emailField,
      passwordField,
      passwordConfirmField,
      accountTypeField,
      submitButton,
      hidePaneTriggers,
      responseData;

  function disableForm() {
    emailField.setAttribute('disabled', true);
    passwordField.setAttribute('disabled', true);
    passwordConfirmField.setAttribute('disabled', true);
    submitButton.setAttribute('disabled', true);
  }

  function enableForm() {
    emailField.removeAttribute('disabled');
    passwordField.removeAttribute('disabled');
    passwordConfirmField.removeAttribute('disabled');
    submitButton.removeAttribute('disabled');
  }

  function resetForm() {
    form.reset();
  }

  function handleFormSignup(e) {
    e.preventDefault();
    disableForm();

    const passwordValue = passwordField.value,
          passwordConfirmValue = passwordConfirmField.value,
          emailValue = emailField.value,
          accountTypeValue = accountTypeField.value,
          countryCode = BC.Utils.getFromLocalStorage(localStorageKeys.country),
          currencyCode = BC.Utils.getFromLocalStorage(localStorageKeys.currency);

    if (emailValue.length === 0 || !BC.Utils.emailValid(emailValue)) {
      BC.ToastMessage.create("Please enter a real email address.", "error");
      enableForm();
    } else if (passwordValue.length === 0 || passwordValue !== passwordConfirmValue) {
      BC.ToastMessage.create("Password and Password Confirmation must match.", "error");
      enableForm();
    } else {
      var request = new XMLHttpRequest();
      const apiDomain = apiMapping[currentDomain],
            params = "email=" + encodeURIComponent(emailValue) +
                      "&password=" + passwordValue +
                      "&password_confirmation=" + passwordConfirmValue +
                      "&account_type=" + accountTypeValue +
                      "&country=" + countryCode +
                      "&currency=" + currencyCode;
      request.open('POST', apiDomain + signUpEndpoint, true);
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      //Send the proper header information along with the request for the POST to work
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          BC.Utils.saveToLocalStorage(localStorageKeys.userSettings, request.responseText);
          
          var decodedData = JSON.parse(BC.Utils.stringDecoder(request.responseText));
          BC.Utils.saveToLocalStorage(localStorageKeys.authToken, decodedData.auth_token);

          BC.Overlay.show("Welcome!", "User account created successfully.", true);
          enableForm();
          resetForm();
          hideFormPane(); // Close the sign up form
          BC.App.setSignedInState(); //Auth token is in local storage, sign them in!
        } else if (request.status === 422) {

          responseData = JSON.parse(request.responseText);
          if (responseData.message && responseData.message.toLowerCase().includes('already exists')) {
            BC.Overlay.show("Sorry! Can't create that account.", responseData.message, true);
          } else if (responseData.message && responseData.message.toLowerCase().includes("password can't be blank")) {
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

    }
  }

  function setEventListeners() {
    form.addEventListener("submit", handleFormSignup);
    hidePaneTriggers.forEach(function(t) {
      t.addEventListener("click", hideFormPane);
    });
  }

  function configureStripeSubscriptionFields() {
    var stripe = Stripe('pk_test_rFBonOYWBSK1R3CkbnLmytIf');
    var elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    var style = {
      base: {
        // Add your base input styles here. For example:
        fontSize: '16px',
        color: "#32325d",
      }
    };

    // Create an instance of the card Element.
    var card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    card.addEventListener('change', function(event) {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  const showFormPane = function showFormPane() {
    formPane.addEventListener('webkitTransitionEnd', BC.Utils.fixSafariScrolling, {once: true});
    formPane.addEventListener('transitionEnd', BC.Utils.fixSafariScrolling, {once: true});
    formPane.classList.add(formVisibleClass);
  };

  const hideFormPane = function hideFormPane() {
    formPane.classList.remove(formVisibleClass);
  };

  const initialize = function initialize() {
    form = document.getElementById(signUpFormId);
    formPane = document.querySelector(formPaneSelector);
    hidePaneTriggers = Array.from(document.querySelectorAll(hidePaneTriggerSelector));
    emailField = document.bcSignUpForm.email;
    passwordField = document.bcSignUpForm.password;
    passwordConfirmField = document.bcSignUpForm.passwordConfirm;
    accountTypeField = document.bcSignUpForm.accountType;
    submitButton = document.querySelector(submitButtonSelector);
    configureStripeSubscriptionFields();
    setEventListeners();
  };

  return {
    initialize: initialize,
    showFormPane: showFormPane,
    hideFormPane: hideFormPane
  };
}();
