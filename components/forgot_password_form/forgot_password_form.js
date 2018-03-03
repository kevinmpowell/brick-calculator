/* globals BC localStorageKeys apiMapping currentDomain customEvents */
'use strict';
BC.ForgotPasswordForm = function() {
  function disableForm() {
    document.bcForgotPasswordForm.email.setAttribute('disabled', true);
  }

  function enableForm() {
    document.bcForgotPasswordForm.email.removeAttribute('disabled');
  }

  function resetForm() {
    document.bcForgotPasswordForm.reset();
  }

  function handlePasswordResetFormSubmit(e) {
    e.preventDefault();
    disableForm();
    const email = document.bcForgotPasswordForm.email.value;

    // Basic validation of the email
    if (email.length < 0 || !BC.Utils.emailValid(email)) {
      BC.ToastMessage.create("Please enter a real email address.", "error");
      resetForm();
      enableForm();
      return;
    }

    BC.API.makeRequest({
      url: '/password/forgot',
      method: 'POST',
      params: {
        email: email
      }
    }).then(
      function(response){
        BC.Overlay.show("Password Reset Email Sent", "Check your email for instructions on how to reset your password.", true);
        resetForm();
        enableForm();
        BC.SignInForm.hideForgotPasswordModal();
      },
      function(response){
        // If there's an error
        BC.Overlay.show("Password Reset Failed", "Something happened and we couldn't connect to reset your password. Sit tight, we'll fix it.", true);
        resetForm();
        enableForm();
      }
    );
  }

  function setEventListeners() {
    document.bcForgotPasswordForm.addEventListener("submit", handlePasswordResetFormSubmit);
  }

  const initialize = function initialize() {
    setEventListeners();
  };

  return {
    initialize: initialize
  };
}();
