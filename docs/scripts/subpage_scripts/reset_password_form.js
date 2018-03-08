var BC = BC || {};

/* globals BC localStorageKeys apiMapping currentDomain customEvents */
'use strict';

const currentDomain = window.location.hostname,
apiMapping = {
  'localhost': 'https://localhost:5000',
  '10.0.1.15': 'http://10.0.1.15:5000',
  'kevinmpowell.github.io': 'https://brickulator-api.herokuapp.com'
},
apiDomain = apiMapping[currentDomain];

BC.ResetPasswordForm = function() {
  const successClass = 'bc-reset-password-form--succeeded';
  // function disableForm() {
  //   document.bcForgotPasswordForm.email.setAttribute('disabled', true);
  // }

  // function enableForm() {
  //   document.bcForgotPasswordForm.email.removeAttribute('disabled');
  // }

  // function resetForm() {
  //   document.bcForgotPasswordForm.reset();
  // }

  // function handlePasswordResetFormSubmit(e) {
  //   e.preventDefault();
  //   disableForm();
  //   const email = document.bcForgotPasswordForm.email.value;

  //   // Basic validation of the email
  //   if (email.length < 0 || !BC.Utils.emailValid(email)) {
  //     BC.ToastMessage.create("Please enter a real email address.", "error");
  //     resetForm();
  //     enableForm();
  //     return;
  //   }

  //   BC.API.makeRequest({
  //     url: '/password/forgot',
  //     method: 'POST',
  //     params: {
  //       email: email
  //     }
  //   }).then(
  //     function(response){
  //       BC.Overlay.show("Password Reset Email Sent", "Check your email for instructions on how to reset your password.", true);
  //       resetForm();
  //       enableForm();
  //       BC.SignInForm.hideForgotPasswordModal();
  //     },
  //     function(response){
  //       // If there's an error
  //       BC.Overlay.show("Password Reset Failed", "Something happened and we couldn't connect to reset your password. Sit tight, we'll fix it.", true);
  //       resetForm();
  //       enableForm();
  //     }
  //   );
  // }

  function showResetSuccess() {
    document.bcResetPasswordForm.classList.add(successClass);
  }

  function showResetError() {
    alert("Cannot reset password. Contact support for details.");
  }

  function resetPassword(newPassword, newPasswordConfirm, resetToken) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', apiDomain + '/password/reset?reset_password_token=' + resetToken + '&password=' + newPassword + '&password_confirmation=' + newPasswordConfirm);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        showResetSuccess();
      } else {
        showResetError();
      }
    };
    xhr.onerror = function () {
      alert("")
    };

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
  }

  function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function handlePasswordResetFormSubmit(e) {
    e.preventDefault();
    const newPassword = this.newPassword.value,
          newPasswordConfirm = this.newPasswordConfirm.value,
          resetToken = getParameterByName('password_reset_token');

    if (typeof resetToken === 'undefined') {
      showResetError();
    } else if (newPassword.length === 0) {
      alert("Please enter a new password.");
    } else if (newPassword !== newPasswordConfirm) {
      alert("Password and password confirmation don't match. Please fix and try again.");
    } else {
      resetPassword(newPassword, newPasswordConfirm, resetToken);
    }

    return false;
  }

  function setEventListeners() {
    document.bcResetPasswordForm.addEventListener("submit", handlePasswordResetFormSubmit);
  }

  const initialize = function initialize() {
    setEventListeners();
  };

  return {
    initialize: initialize
  };
}();
BC.ResetPasswordForm.initialize();
