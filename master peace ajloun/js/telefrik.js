// let counter = 1;
// setInterval(() => {
//   document.getElementById('radio1-' + counter).checked = true;
//   document.getElementById('radio2-' + counter).checked = true;
//   document.getElementById('radio3-' + counter).checked = true;
//   counter++;
//   if (counter > 4) {
//     counter = 1;
//   }
// }, 2000); // Change image every 5 seconds
// document.getElementById('open-popup').addEventListener('click', function () {
//   document.getElementById('popup').style.display = 'block';
// });

// document.getElementById('close-popup').addEventListener('click', function () {
//   document.getElementById('popup').style.display = 'none';
// });


// document.querySelectorAll('.bookingForm').forEach(form => {
//   form.addEventListener('submit', function (e) {
//     e.preventDefault();

//     const service = this.dataset.service;
//     const name = this.querySelector('input[type="text"]').value;
//     const email = this.querySelector('input[type="email"]').value;
//     const date = this.querySelector('input[type="date"]').value;
//     const guests = this.querySelector('input[type="number"]').value;

//     // Show loading indicator
//     document.getElementById('loadingIndicator').style.display = 'block';

//     // Simulate API call
//     setTimeout(() => {
//       // Hide loading indicator
//       document.getElementById('loadingIndicator').style.display = 'none';

//       // Display summary
//       const summaryContent = `
//                         <div class="summary-item"><strong>Service:</strong> ${service.replace('_', ' ').toUpperCase()}</div>
//                         <div class="summary-item"><strong>Name:</strong> ${name}</div>
//                         <div class="summary-item"><strong>Email:</strong> ${email}</div>
//                         <div class="summary-item"><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</div>
//                         <div class="summary-item"><strong>Guests:</strong> ${guests}</div>
//                     `;
//       document.getElementById('summaryContent').innerHTML = summaryContent;
//       document.getElementById('summarySection').style.display = 'block';

//       // Reset form
//       this.reset();
//     }, 2000); // Simulating a 2-second delay
//   });
// });

// // Dynamic date validation
// document.querySelectorAll('input[type="date"]').forEach(dateInput => {
//   dateInput.addEventListener('input', function () {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const selectedDate = new Date(this.value);
//     if (selectedDate < today) {
//       this.setCustomValidity('Please select a future date');
//     } else {
//       this.setCustomValidity('');
//     }
//   });
// });

// // Dynamic guest number validation
// document.querySelectorAll('input[type="number"]').forEach(guestInput => {
//   guestInput.addEventListener('input', function () {
//     const maxGuests = 10;
//     if (this.value > maxGuests) {
//       this.setCustomValidity(`Maximum ${maxGuests} guests allowed`);
//     } else {
//       this.setCustomValidity('');
//     }
//   });
// });
// document.getElementById('close-popup').addEventListener('click', function () {
//   // Get the values from the form
//   const name = document.getElementById('name-city').value;
//   const email = document.getElementById('email-city').value;
//   const date = document.getElementById('date-city').value;
//   const guests = document.getElementById('guests-city').value;

//   // Create an object to store the data
//   const bookingData = {
//     service: 'City Tour',
//     name: name,
//     email: email,
//     date: date,
//     guests: guests
//   };

//   // Save the data to localStorage
//   localStorage.setItem('bookingData', JSON.stringify(bookingData));

//   // Optionally close the popup
//   document.getElementById('popup').style.display = 'none';

//   // You can also display the result on the same page (under the popup)
//   displayBookingData(bookingData);
// });

// function displayBookingData(data) {
//   const summaryContent = document.getElementById('summaryContent');
//   summaryContent.innerHTML = `
//         <h3>Your Booking:</h3>
//         <p>Service: ${data.service}</p>
//         <p>Name: ${data.name}</p>
//         <p>Email: ${data.email}</p>
//         <p>Date: ${data.date}</p>
//         <p>Number of Guests: ${data.guests}</p>
//     `;
// }











// const tabs = document.querySelectorAll('.paytabs li');
// const paymentForms = document.querySelectorAll('.payment-form');

// tabs.forEach(tab => {
//   tab.addEventListener('click', () => {
//     document.querySelector('.paytabs li.payactive').classList.remove('payactive');
//     tab.classList.add('payactive');

//     // Hide all payment forms
//     paymentForms.forEach(form => form.classList.remove('active'));

//     // Show the payment form corresponding to the current tab
//     const tabIndex = Array.prototype.indexOf.call(tabs, tab);
//     paymentForms[tabIndex].classList.add('active');
//   });
// });