////////////////function to display all services in services page 

// fetch('https://localhost:44321/api/Services')
//     .then(response => response.json())
//     .then(data => {
//         // Access the $values array which holds the actual service objects
//         const servicesArray = data.$values;

//         // Check if servicesArray is an array and has elements
//         if (!Array.isArray(servicesArray) || servicesArray.length === 0) {
//             throw new Error('No services data received from the API');
//         }

//         // Get the container where services will be displayed
//         const servicesContainer = document.getElementById('services-container');
//         if (!servicesContainer) {
//             console.error('Services container element not found');
//             return;
//         }

//         // Clear the container before adding new content
//         servicesContainer.innerHTML = '';

//         // Iterate over each service and create the HTML content
//         servicesArray.forEach(service => {
//             const cardHTML = `
//                 <div class="col-lg-4 wow fadeInUp" data-wow-delay="0.2s">
//                     <div class="blog-item">
//                         <div class="blog-img">
//                             <a href="service-details.html?id=${service.serviceId}">
//                                 <img src="${service.image}" class="img-fluid w-100 rounded-top" alt="${service.serviceName}" style="width: 100%; height: 30vh" />
//                             </a>
//                             <div class="blog-category py-2 px-4">${service.serviceName}</div>
//                             <div class="blog-date">
//                                 <i class="fas fa-clock me-2"></i>${service.dates}
//                             </div>
//                         </div>
//                         <div class="blog-content p-4">
//                             <a href="service-details.html?id=${service.serviceId}" class="h4 d-inline-block mb-4">
//                                 ${service.question}
//                             </a>
//                             <p class="mb-4">${service.description}</p>
//                             <a href="service-details.html?id=${service.serviceId}" class="btn btn-primary rounded-pill py-2 px-4">Read More <i class="fas fa-arrow-right ms-2"></i></a>
//                         </div>
//                     </div>
//                 </div>
//             `;
//             // Append each card to the container
//             servicesContainer.innerHTML += cardHTML;
//         });

//         console.log('Services loaded successfully');
//     })
//     .catch(error => {
//         console.error('Error fetching the services:', error);
//     });

/////////////////////////////////////////////////


// Fetch and display all services in services page
// Helper function to decode the JWT and extract payload
function parseJwt(token) {
    // Split the token into its parts
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode the payload
    const jsonPayload = decodeURIComponent(escape(window.atob(base64)));
    return JSON.parse(jsonPayload);
}



const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZCIsImVtYWlsIjoiaHJfbWFuYWdlckBvdXRsb29rLmNvbSIsImp0aSI6IjYyZTAzZGY3LWFkZDYtNDNiYS04MmEwLTVmMzg2MWVkMGU2NSIsImV4cCI6MTcyNjg4MDc5MywiaXNzIjoieW91cklzc3VlciIsImF1ZCI6InlvdXJBdWRpZW5jZSJ9.uHiTy3srFbcMvZcx0za11gia5FFBCO2bIZQ9IMgtAN4';

const decodedToken = parseJwt(jwt);
const userId = decodedToken.sub || decodedToken.userId; // Adjust based on your token structure
if (userId != 0 && null) {

    alert('User ID:', userId);
}




// Fetch services and display them on the page
fetch('https://localhost:44321/api/Services')
    .then(response => response.json())
    .then(data => {
        // Access the $values array which holds the actual service objects
        const servicesArray = data.$values;

        // Check if servicesArray is an array and has elements
        if (!Array.isArray(servicesArray) || servicesArray.length === 0) {
            throw new Error('No services data received from the API');
        }

        // Get the container where services will be displayed
        const servicesContainer = document.getElementById('services-container');
        if (!servicesContainer) {
            console.error('Services container element not found');
            return;
        }

        // Clear the container before adding new content
        servicesContainer.innerHTML = '';

        // Iterate over each service and create the HTML content
        servicesArray.forEach(service => {
            const cardHTML = `
                <div class="col-lg-4 wow fadeInUp" data-wow-delay="0.2s">
                    <div class="blog-item">
                        <div class="blog-img">
                            <a href="service-details.html?id=${service.serviceId}">
                                <img src="${service.image}" class="img-fluid w-100 rounded-top" alt="${service.serviceName}" style="width: 100%; height: 30vh" />
                            </a>
                            <div class="blog-category py-2 px-4">${service.serviceName}</div>
                            <div class="blog-date">
                                <i class="fas fa-clock me-2"></i>${service.dates}
                            </div>
                        </div>
                        <div class="blog-content p-4">
                            <a href="service-details.html?id=${service.serviceId}" class="h4 d-inline-block mb-4 book-button" data-service-id="${service.serviceId}" data-image="${service.image}">${service.question}</a>
                            <p class="mb-4">${service.description}</p>
                            <a href="service-details.html?id=${service.serviceId}" class="btn btn-primary rounded-pill py-2 px-4" data-service-id="${service.serviceId}">Read More <i class="fas fa-arrow-right ms-2"></i></a>
                        </div>
                    </div>
                </div>
           
            
                `;
            // Append each card to the container
            servicesContainer.innerHTML += cardHTML;
        });

        console.log('Services loaded successfully');

        // Add event listeners to all "Book Now" buttons
        document.querySelectorAll('.book-button').forEach(button => {
            button.addEventListener('click', function () {
                const serviceName = this.textContent; // Use textContent for service name
                const serviceId = this.getAttribute('data-service-id');
                const serviceImage = this.getAttribute('data-image');

                // Set the service details in the popup
                document.getElementById('service-title').textContent = serviceName;
                document.getElementById('open-popup').setAttribute('data-service-id', serviceId);
                document.getElementById('open-popup').setAttribute('data-service', serviceName);
                document.getElementById('open-popup').setAttribute('data-image', serviceImage);

                // Show the popup
                document.getElementById('popup').style.display = 'block';
            });
        });

        console.log('Services loaded successfully');
    })
    .catch(error => {
        console.error('Error fetching the services:', error);
    });

// Function to close the popup and submit booking form
// Helper function to decode the JWT and extract payload
// Helper function to decode the JWT and extract payload
function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload); // Return the decoded payload
}

// Function to handle booking submission
// JWT parsing function

document.addEventListener('DOMContentLoaded', function () {
    const closePopupButton = document.getElementById('close-popup');
    const openPopupButton = document.getElementById('open-popup');
    const popup = document.getElementById('popup');

    closePopupButton.addEventListener('click', function () {
        var name = document.getElementById('name-city').value.trim();
        var email = document.getElementById('email-city').value.trim();
        var date = document.getElementById('date-city').value;
        var guests = document.getElementById('guests-city').value;
        var price = document.getElementById('price').value;

        // Validation checks
        if (!name || !email || !date || !guests) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all fields.'
            });
            return;
        }

        if (!isValidEmail(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.'
            });
            return;
        }

        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            console.error('JWT is missing. User is not authenticated.');
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'Please log in to make a booking.'
            });
            return;
        }

        // Parse the JWT to get the user ID
        const decodedToken = parseJwt(jwt);
        const userId = decodedToken.userId || decodedToken.sub;

        if (!userId) {
            console.error('User ID not found in the JWT.');
            Swal.fire({
                icon: 'error',
                title: 'User ID Error',
                text: 'Unable to retrieve user information. Please try logging in again.'
            });
            return;
        }

        const serviceId = openPopupButton.getAttribute("data-service-id");
        const bookingDate = new Date(date);

        // Calculate total amount based on number of guests and price
        const totalAmount = parseInt(guests) * parseFloat(price);

        // const bookingData = {
        //     userId: userId, // This is already correct as it's extracted from the JWT
        //     serviceId: parseInt(serviceId, 10), // Parse serviceId as an integer
        //     bookingDate: bookingDate.toISOString(), // Convert date to ISO string format
        //     numberOfPeople: parseInt(guests, 10), // Parse number of guests as an integer
        //     totalAmount: totalAmount, // Use the calculated total amount
        //     status: "pending" // This can remain as is
        // };
        const bookingData = {
            userId: userId, // This is already correct as it's extracted from the JWT
            serviceId: 1, // Parse serviceId as an integer
            bookingDate: "2024-09-21", // Ensure the correct date format // Convert date to ISO string format
            numberOfPeople: 2, // Ensure it's an integer// Parse number of guests as an integer
            totalAmount: 20, // Use the calculated total amount
            status: "pending" // This can remain as is
        };

        console.log('Booking Data:', bookingData); // Log the data for debugging

        fetch('https://localhost:44321/api/Bookings/bookingtour', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(bookingData)
        })
            // ... (rest of the fetch code remains the same)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error('Server response:', errorData);
                        throw new Error('Booking failed due to validation errors');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Booking successful:', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Successful',
                    text: 'Your booking will be displayed on the profile page.'
                });
                popup.style.display = 'none';
            })
            .catch(error => {
                console.error('Error during booking process:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed',
                    text: error.message || 'An unexpected error occurred. Please try again.'
                });
            });
    });
});


// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Make sure you have this function defined
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}





















// Temporarily hardcode a service ID for testing
////////////////function to display service Details in service page 
debugger
document.addEventListener('DOMContentLoaded', function () {
    // Log the current URL for debugging
    console.log('Current URL:', window.location.href);

    // Get the service ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    console.log('URL Parameters:', urlParams.toString());
    console.log('Service ID from URL:', serviceId);  // Debugging line

    if (serviceId) {
        // Fetch service details by ID
        fetch(`https://localhost:44321/api/Services/${serviceId}`)
            .then(response => response.json())
            .then(service => {
                // Update the details page with the service info
                document.querySelector('.service-image').src = service.image;
                document.querySelector('.title').textContent = service.serviceName;
                document.querySelector('.description').textContent = service.description2;
                document.querySelector('.price').textContent = service.price;
                document.querySelector('.question').textContent = service.question;


            })
            .catch(error => {
                console.error('Error fetching service details:', error);
            });
    } else {
        console.error('Service ID not found in URL.');
    }
});


//////////////////// function to disaply the proposal services 
function loadProposalServices() {
    fetch('https://localhost:44321/api/Services') // Assuming you have this API
        .then(response => response.json())
        .then(data => {
            // Check if the data contains the expected $values property
            const servicesArray = data.$values;
            if (!Array.isArray(servicesArray) || servicesArray.length === 0) {
                throw new Error('No services data received from the API');
            }

            const proposalContainer = document.querySelector('.scontainer_container');
            if (!proposalContainer) {
                console.error('Proposal container element not found');
                return;
            }

            proposalContainer.innerHTML = ''; // Clear existing content

            // Shuffle the array of services
            const shuffledServices = servicesArray.sort(() => 0.5 - Math.random());

            // Get the first two services
            const selectedServices = shuffledServices.slice(0, 2);

            selectedServices.forEach(service => {
                const serviceHTML = `
                    <div class="scontainer2" onclick="navigateToService(${service.serviceId})">
                        <div class="image-container2">
                            <img src="${service.image}" alt="${service.serviceName}" />
                        </div>
                        <div class="content2">
                            <h1 class="title2">${service.serviceName}</h1>
                            <p class="description2">${service.description}</p>
                            <a href="service-details.html?id=${service.serviceId}" class="read-more2 rounded-pill py-2 px-4">Explore.. <i class="fas fa-arrow-right ms-2"></i></a>
                        </div>
                    </div>
                `;
                proposalContainer.innerHTML += serviceHTML;
            });

            console.log('Proposal services loaded successfully');
        })
        .catch(error => {
            console.error('Error fetching proposal services:', error);
        });
}

// Call this function when the document is ready or when needed
document.addEventListener('DOMContentLoaded', loadProposalServices);

///////////////////////////// for explain button






////////////////////////////////////// for chack the user id for booking button document.getElementById('open-popup').addEventListener('click', function() {




