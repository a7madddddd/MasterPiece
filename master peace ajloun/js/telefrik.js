










const tabs = document.querySelectorAll('.paytabs li');
const paymentForms = document.querySelectorAll('.payment-form');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelector('.paytabs li.payactive').classList.remove('payactive');
    tab.classList.add('payactive');

    // Hide all payment forms
    paymentForms.forEach(form => form.classList.remove('active'));

    // Show the payment form corresponding to the current tab
    const tabIndex = Array.prototype.indexOf.call(tabs, tab);
    paymentForms[tabIndex].classList.add('active');
  });
});









