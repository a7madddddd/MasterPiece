    debugger
    document.addEventListener('DOMContentLoaded', function () {
        // Assuming JWT token is stored in localStorage
        const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        console.error('JWT is missing. User is not authenticated.');
    return;
        }

    // Parse the JWT to get the user ID
    const decodedToken = parseJwt(jwt);
    const userId = decodedToken.userId || decodedToken.sub;

    // API URL to get services booked by the user
        const apiUrl = `https://localhost:44321/api/Users/user/${userId}/services`;
        

    // Function to parse JWT (if not already defined)
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

    // Fetch services and update the order summary
        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${jwt}` // Pass the token for authentication
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Log the response data to inspect its structure

                const orderItemsContainer = document.getElementById('order-items');
                const totalPriceElement = document.getElementById('total-price');
                let totalPrice = 0;

                // Clear the previous items
                orderItemsContainer.innerHTML = '';

                // Check if the data is an array or wrapped in an object
                if (Array.isArray(data)) {
                    // Loop through the data if it's an array
                    data.forEach(service => {
                        const orderItemDiv = document.createElement('div');
                        orderItemDiv.classList.add('order-item');

                        // Create elements for service name and price
                        const serviceNameElement = document.createElement('span');
                        serviceNameElement.textContent = service.serviceName;

                        const priceElement = document.createElement('span');
                        priceElement.textContent = `$${service.price.toFixed(2)}`;

                        // Append the elements to the order item
                        orderItemDiv.appendChild(serviceNameElement);
                        orderItemDiv.appendChild(priceElement);

                        // Append the order item to the container
                        orderItemsContainer.appendChild(orderItemDiv);

                        // Calculate the total price
                        totalPrice += service.price;
                    });

                    // Update the total price in the UI
                    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
                } else if (data.$values) {
                    // If data is wrapped in a $values property
                    data.$values.forEach(service => {
                        const orderItemDiv = document.createElement('div');
                        orderItemDiv.classList.add('order-item');

                        const serviceNameElement = document.createElement('span');
                        serviceNameElement.textContent = service.serviceName;

                        const priceElement = document.createElement('span');
                        priceElement.textContent = `${service.price.toFixed(2)} jd`;

                        orderItemDiv.appendChild(serviceNameElement);
                        orderItemDiv.appendChild(priceElement);
                        orderItemsContainer.appendChild(orderItemDiv);

                        totalPrice += service.price;
                    });

                    totalPriceElement.textContent = `${totalPrice.toFixed(2)} jd`;
                } else {
                    console.error('Unexpected response format:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });

    });
