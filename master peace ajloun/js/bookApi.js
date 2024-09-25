// document.addEventListener('DOMContentLoaded', function () {
//     // Assuming JWT token is stored in localStorage
//     const jwt = localStorage.getItem('jwt');
//     if (!jwt) {
//         console.error('JWT is missing. User is not authenticated.');
//         return;
//     }

//     // Parse the JWT to get the user ID
//     const decodedToken = parseJwt(jwt);
//     const userId = decodedToken.userId || decodedToken.sub;

//     // API URL to get services booked by the user
//     const apiUrl = `https://localhost:44321/api/Users/user/${userId}/services`;

//     // Function to parse JWT (if not already defined)
//     function parseJwt(token) {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(
//             atob(base64)
//                 .split('')
//                 .map(function (c) {
//                     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//                 }).join('')
//         );
//         return JSON.parse(jsonPayload);
//     }

//     // Fetch services and update the order summary
//     fetch(apiUrl, {
//         headers: {
//             'Authorization': `Bearer ${jwt}`
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             const orderItemsContainer = document.getElementById('order-items');
//             const totalPriceElement = document.getElementById('total-price');
//             let totalPrice = 0;

//             // Clear previous items
//             orderItemsContainer.innerHTML = '';

//             if (Array.isArray(data)) {
//                 data.forEach(service => {
//                     const orderItemDiv = document.createElement('div');
//                     orderItemDiv.classList.add('order-item');

//                     const serviceNameElement = document.createElement('span');
//                     serviceNameElement.textContent = service.serviceName;

//                     const priceElement = document.createElement('span');
//                     priceElement.textContent = `$${service.price.toFixed(2)}`;

//                     orderItemDiv.appendChild(serviceNameElement);
//                     orderItemDiv.appendChild(priceElement);
//                     orderItemsContainer.appendChild(orderItemDiv);

//                     totalPrice += service.price;
//                 });

//                 totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
//             } else if (data.$values) {
//                 data.$values.forEach(service => {
//                     const orderItemDiv = document.createElement('div');
//                     orderItemDiv.classList.add('order-item');

//                     const serviceNameElement = document.createElement('span');
//                     serviceNameElement.textContent = service.serviceName;

//                     const priceElement = document.createElement('span');
//                     priceElement.textContent = `${service.price.toFixed(2)} jd`;

//                     orderItemDiv.appendChild(serviceNameElement);
//                     orderItemDiv.appendChild(priceElement);
//                     orderItemsContainer.appendChild(orderItemDiv);

//                     totalPrice += service.price;
//                 });

//                 totalPriceElement.textContent = `${totalPrice.toFixed(2)} jd`;
//             } else {
//                 console.error('Unexpected response format:', data);
//             }

//         })
// });





////////////
document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('payment-form');
    const cardNumber = document.getElementById('card-number');
    const expiry = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');
    const paypalEmail = document.getElementById('paypal-email');
    const phoneNumber = document.getElementById('phone-number');
    const paymentMethods = document.querySelectorAll('.payment-method');

    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            const selectedMethod = method.dataset.method;
            document.getElementById('card-payment-fields').style.display = selectedMethod === 'card' ? 'block' : 'none';
            document.getElementById('paypal-fields').style.display = selectedMethod === 'paypal' ? 'block' : 'none';
            document.getElementById('orange-money-fields').style.display = selectedMethod === 'orange-money' ? 'block' : 'none';
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            simulatePayment();
        }
    });

    // Card number formatting
    cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i % 4 === 0 && i > 0) formattedValue += ' ';
            formattedValue += value[i];
        }
        e.target.value = formattedValue;
    });

    // Expiry date formatting
    expiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        const activeMethod = document.querySelector('.payment-method.active').dataset.method;

        if (activeMethod === 'card') {
            if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardNumber.value)) {
                alert('Please enter a valid card number.');
                isValid = false;
            }
            if (!/^\d{2}\/\d{2}$/.test(expiry.value)) {
                alert('Please enter a valid expiry date (MM/YY).');
                isValid = false;
            }
            if (!/^\d{3}$/.test(cvv.value)) {
                alert('Please enter a valid CVV.');
                isValid = false;
            }
        } else if (activeMethod === 'paypal') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail.value)) {
                alert('Please enter a valid PayPal email address.');
                isValid = false;
            }
        } else if (activeMethod === 'orange-money') {
            if (!/^\d{10}$/.test(phoneNumber.value)) {
                alert('Please enter a valid phone number (10 digits).');
                isValid = false;
            }
        }

        return isValid;
    }

    // Simulated payment processing
    function simulatePayment() {
        const btn = document.querySelector('.btn');
        btn.disabled = true;
        btn.textContent = 'Processing...';

        // Determine the selected payment method
        const activeMethod = document.querySelector('.payment-method.active').dataset.method;

        // Simulate payment processing based on the selected method
        if (activeMethod === 'card') {
            simulateCreditCardPayment();
        } else if (activeMethod === 'paypal') {
            simulatePayPalPayment();
        } else if (activeMethod === 'orange-money') {
            simulateOrangeMoneyPayment();
        }
    }

    function simulateCreditCardPayment() {
        setTimeout(() => {
            document.querySelector('.btn').textContent = 'Payment Successful!';
            document.querySelector('.btn').style.backgroundColor = '#27ae60';
            alert('Credit card payment processed successfully! Thank you for your booking.');
            form.reset();
            setTimeout(() => {
                document.querySelector('.btn').disabled = false;
                document.querySelector('.btn').textContent = 'Pay Now';
                document.querySelector('.btn').style.backgroundColor = '';
            }, 3000);
        }, 2000);
    }

    function simulatePayPalPayment() {
        setTimeout(() => {
            document.querySelector('.btn').textContent = 'Payment Successful!';
            document.querySelector('.btn').style.backgroundColor = '#27ae60';
            alert('PayPal payment processed successfully! Thank you for your booking.');
            form.reset();
            setTimeout(() => {
                document.querySelector('.btn').disabled = false;
                document.querySelector('.btn').textContent = 'Pay Now';
                document.querySelector('.btn').style.backgroundColor = '';
            }, 3000);
        }, 2000);
    }

    function simulateOrangeMoneyPayment() {
        setTimeout(() => {
            document.querySelector('.btn').textContent = 'Payment Successful!';
            document.querySelector('.btn').style.backgroundColor = '#27ae60';
            alert('Orange Money payment processed successfully! Thank you for your booking.');
            form.reset();
            setTimeout(() => {
                document.querySelector('.btn').disabled = false;
                document.querySelector('.btn').textContent = 'Pay Now';
                document.querySelector('.btn').style.backgroundColor = '';
            }, 3000);
        }, 2000);
    }
});