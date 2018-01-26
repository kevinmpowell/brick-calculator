'use strict';
BC.NewsletterSignUpForm = function() {

  const formSelector = '.bc-newsletter-sign-up-form__form',
        emailInputSelector = '.bc-newsletter-sign-up-form__email-address',
        subscribeButtonSelector = '.bc-newsletter-sign-up-form__submit';

  let newsletterForms,
      submitButton,
      emailInput;

  const newsletterSubscriptionSucceeded = function newsletterSubscriptionSucceeded() {
    // TOAST MESSAGE, FADE OUT FORM
    alert("You're all signed up!");
  }

  const newsletterSubscriptionFailed = function newsletterSubscriptionFailed() {
    // TOAST MESSAGE
    alert("Unable to subscribe you to the newsletter at this time.");
    enableForm();
  }

  function addSubscriberToNewsletterList(email) {
    BC.API.makeRequest({
      url: '/subscribe',
      method: 'POST',
      params: {
        email: email
      }
    }).then(newsletterSubscriptionSucceeded, newsletterSubscriptionFailed);
  }

  function emailValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function enableForm() {
    emailInput.removeAttribute("disabled");
    submitButton.removeAttribute("disabled");
  }

  function disableForm() {
    emailInput.setAttribute("disabled", true);
    submitButton.setAttribute("disabled", true);
  }

  function handleNewsletterSignUpFormSubmit(e) {
    e.preventDefault();
    emailInput = this.querySelector(emailInputSelector),
    submitButton = this.querySelector(subscribeButtonSelector);
    disableForm();

    const email = emailInput.value;
    
    if (emailValid(email)) {
      addSubscriberToNewsletterList(email);
    } else {
      alert("Please enter a real email address.");
      enableForm();
    }
  }

  function setEventListeners() {
    newsletterForms.forEach(function(f){
      f.addEventListener("submit", handleNewsletterSignUpFormSubmit);
    });
  }

  const initialize = function initialize() {
    newsletterForms = Array.from(document.querySelectorAll(formSelector));
    setEventListeners();
    // number = document.querySelector(numberSelector);
    // year = document.querySelector(yearSelector);
    // title = document.querySelector(titleSelector);
    // pcs = document.querySelector(pcsSelector);
    // msrp = document.querySelector(msrpSelector);
  }

  return {
    initialize: initialize
  }
}();
