/* globals BC localStorageKeys apiMapping currentDomain Stripe */

'use strict';
BC.SignUpForm = function() {
  const signUpFormId = 'bc-sign-up-form',
        submitButtonSelector = '.bc-sign-up-form__submit-button',
        signUpEndpoint = '/signup',
        formPaneSelector = '.bc-sign-up-form-pane',
        formVisibleClass = 'bc-sign-up-form-pane--visible',
        hidePaneTriggerSelector = '.bc-sign-up-form-pane-hide-trigger',
        brickulatorPlusSelectedClass = 'bc-sign-up-form--brickulator-plus-selected',
        stripe = Stripe('pk_live_rqMarN9iPbkAnuZa2fYC3iNq'),
        elements = stripe.elements(),
        stripeFieldStyles = {
          base: {
            fontFamily: '"Hiragino Sans", Helvetica, sans-serif',
            fontSize: "16px",
            lineHeight: "32px"
          }
        },
        card = elements.create('card', {style: stripeFieldStyles});


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

  function handleAccountTypeChange() {
    if (this.value === 'plus') {
      // If a brickulator plus account is selected, add a modifier class to the form (to show the CC info)
      form.classList.add(brickulatorPlusSelectedClass);
    } else {
      form.classList.remove(brickulatorPlusSelectedClass);
    }
  }

  function handleFormSignup(e) {
    e.preventDefault();
    disableForm();

    const passwordValue = passwordField.value,
          passwordConfirmValue = passwordConfirmField.value,
          emailValue = emailField.value,
          accountTypeValue = accountTypeField.value;

    if (emailValue.length === 0 || !BC.Utils.emailValid(emailValue)) {
      BC.ToastMessage.create("Please enter a real email address.", "error");
      enableForm();
    } else if (passwordValue.length === 0 || passwordValue !== passwordConfirmValue) {
      BC.ToastMessage.create("Password and Password Confirmation must match.", "error");
      enableForm();
    } else {
      BC.Overlay.show("Sit tight.", "Creating your account.", true);
      if (accountTypeValue === 'plus') {
        // Process CC info through stripe and get secure token
        stripe.createToken(card).then(function(result) {
          if (result.error) {
            // Inform the customer that there was an error.
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
            BC.Overlay.hide();
            enableForm();
          } else {
            console.log(result.token);
            sendSignUpAPICall(emailValue, passwordValue, passwordConfirmValue, accountTypeValue, result.token.id);
          }
        });
      } else {
        sendSignUpAPICall(emailValue, passwordValue, passwordConfirmValue, accountTypeValue, false); // no token
      }
    }
  }

  function sendSignUpAPICall(emailValue, passwordValue, passwordConfirmValue, accountTypeValue, token) {
    const countryCode = BC.Utils.getFromLocalStorage(localStorageKeys.country),
          currencyCode = BC.Utils.getFromLocalStorage(localStorageKeys.currency);
    // Send the token to your server.
    // stripeTokenHandler(result.token);

    var request = new XMLHttpRequest();
    const apiDomain = apiMapping[currentDomain];

    let params = "email=" + encodeURIComponent(emailValue) +
                    "&password=" + passwordValue +
                    "&password_confirmation=" + passwordConfirmValue +
                    "&account_type=" + accountTypeValue +
                    "&country=" + countryCode +
                    "&currency=" + currencyCode;
    if (token) {
      params += "&stripe_token=" + token;
    }

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
        gtag('event', 'sign_up');
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
        BC.Overlay.hide();
        enableForm();
      } else {
        alert("Sign up failed - connection successful, but data failed");
        BC.Overlay.hide();
        enableForm();
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      alert("Could not sign up - connection error");
      BC.Overlay.hide();
      enableForm();
    };

    request.send(params); // POST params are sent down here
  }

  function setEventListeners() {
    form.addEventListener("submit", handleFormSignup);
    Array.from(accountTypeField).forEach(function(radio){
      radio.addEventListener("change", handleAccountTypeChange);
    });

    hidePaneTriggers.forEach(function(t) {
      t.addEventListener("click", hideFormPane);
    });
  }

  function configureStripeSubscriptionFields() {



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
