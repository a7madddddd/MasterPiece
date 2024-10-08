document.addEventListener('DOMContentLoaded', function () {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'You are not authenticated. Please log in and try again.',
        });
        return;
    }

    const decodedToken = parseJwt(jwt);
    const userId = decodedToken.userId || decodedToken.sub;

    // Get bookingId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    if (!bookingId) {
        Swal.fire({
            icon: 'info',
            title: 'No Booking ',
            text: 'No booking Untill Now.',
        }).then(() => {
            // This code runs after the user closes the alert
            window.location.href = 'services.html'; // Redirect after closing the alert
        });
        return;
    }


    const apiUrl = `https://localhost:44321/api/Bookings/${bookingId}`;

    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')
        );
        return JSON.parse(jsonPayload);
    }

    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(booking => {
            console.log('Fetched Booking:', booking);

            const orderItemsContainer = document.getElementById('order-items');
            const totalPriceElement = document.getElementById('total-price');

            // Ensure the container is empty before populating it
            orderItemsContainer.innerHTML = '';

            // Create booking row
            const orderItemDiv = document.createElement('div');
            orderItemDiv.classList.add('order-item');

            const serviceNameElement = document.createElement('span');
            serviceNameElement.textContent = booking.serviceName;

            const priceElement = document.createElement('span');
            priceElement.textContent = `${booking.totalAmount.toFixed(2)} jd`;

            orderItemDiv.appendChild(serviceNameElement);
            orderItemDiv.appendChild(priceElement);
            orderItemsContainer.appendChild(orderItemDiv);

            totalPriceElement.textContent = `${booking.totalAmount.toFixed(2)} jd`;

            // Initialize PayPal button after loading booking details
            initPayPalButton(booking.totalAmount, userId, booking);
        })
        .catch(error => {
            console.error('Error fetching booking details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Loading Error',
                text: 'Unable to load booking details. Please try again later.',
            });
        });

    function initPayPalButton(totalAmount, userId, booking) {
        let processingPayment = false;
        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'paypal',
            },
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{ "amount": { "currency_code": "USD", "value": totalAmount } }]
                });
            },
            onApprove: function (data, actions) {
                if (processingPayment) {
                    return;
                }
                processingPayment = true;

                Swal.fire({
                    title: 'Processing Payment',
                    html: 'Please wait while we process your payment...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                return actions.order.capture().then(function (orderData) {
                    processingPayment = false;

                    const paymentDetails = {
                        amount: totalAmount,
                        paymentStatus: orderData.status,
                        paymentMethod: 'PayPal',
                        serviceId: booking.serviceId,
                        bookingId: booking.bookingId,
                        serviceName: orderData.serviceName  // Added service name here
                    };

                    return fetch(`https://localhost:44321/api/Payments/paymentByUserId/${userId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`
                        },
                        body: JSON.stringify(paymentDetails)
                    })
                        .then(response => {
                            if (!response.ok) {
                                return response.text().then(errorText => {
                                    console.error('Payment API Error:', errorText);
                                    throw new Error('Payment API response was not ok');
                                });
                            }
                            return response.json();
                        })
                        .then(apiResponse => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Payment Successful',
                                text: 'Thank you for your payment!',
                                showConfirmButton: false,
                                timer: 2000
                            }).then(() => {
                                // Redirect to bookings page after successful payment
                                window.location.href = 'edit_profile.html';
                            });
                        });
                }).catch(error => {
                    processingPayment = false;
                    console.error('Payment Capture Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Payment Error',
                        text: 'There was an error processing your payment. Please try again.',
                    });
                });
            },
            onError: function (err) {
                console.error('PayPal Button Error:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Error',
                    text: 'There was an error initializing the payment. Please try again later.',
                });
            }
        }).render('#paypal-button-container');
    }
});


































// Check if JWT is in local storage
document.addEventListener("DOMContentLoaded", function () {
    // Check if the element with ID 'userBox' exists
    const userBox = document.getElementById('userBox');

    if (userBox) {
        // Check if JWT is in local storage
        const token = localStorage.getItem('jwt');

        if (token) {
            // If user is logged in (JWT token found), show profile link
            userBox.innerHTML = `
            <a href="edit_profile.html" id ="profile_icon">Profile</a>         <small style="color: whitesmoke;">|</small>



            <div class="user_box_link">
            <a href="#" id="logoutButton">Logout</a>
            </div>
            `;

            // Attach logout functionality to the "Logout" button
            document.getElementById('logoutButton').addEventListener('click', function (event) {
                event.preventDefault(); // Prevent default link behavior
                logout();
            });
        } else {
            // If user is not logged in, show login/register links
            userBox.innerHTML = `
                <div class="user_box_login user_box_link">
                    <a href="login.html">Login</a>
                </div>
                <div class="user_box_register user_box_link">
                    <a href="login.html">Register</a>
                </div>
            `;
        }
    } else {
        console.error("Element with ID 'userBox' not found.");
    }
});

// Function to handle logout, moved outside of the event listener
function logout() {
    localStorage.removeItem('jwt'); // Remove JWT from local storage
    alert("Logged out successfully!");
    window.location.reload(); // Reload the page to refresh the navbar
}












