

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



    // const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZCIsImVtYWlsIjoiaHJfbWFuYWdlckBvdXRsb29rLmNvbSIsImp0aSI6IjYyZTAzZGY3LWFkZDYtNDNiYS04MmEwLTVmMzg2MWVkMGU2NSIsImV4cCI6MTcyNjg4MDc5MywiaXNzIjoieW91cklzc3VlciIsImF1ZCI6InlvdXJBdWRpZW5jZSJ9.uHiTy3srFbcMvZcx0za11gia5FFBCO2bIZQ9IMgtAN4';

    // const decodedToken = parseJwt(jwt);
    // const userId = decodedToken.sub || decodedToken.userId; // Adjust based on your token structure
    // if (userId != 0 && null) {

    //     alert('User ID:', userId);
    // }




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

        // Iterate over each service and create the HTML content if it is active
        servicesArray.forEach(service => {
            if (service.isActive) { // Check if the service is active
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

                // Append each active service card to the container
                servicesContainer.innerHTML += cardHTML;
            }
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
        return JSON.parse(jsonPayload); 
    }

    // Function to handle booking submission
    // JWT parsing function

document.addEventListener('DOMContentLoaded', function () {
    const closePopupButton = document.getElementById('close-popup');
    const popup = document.getElementById('popup');

    const openPopupButton = document.getElementById('open-popup');
    openPopupButton.addEventListener('click', function () {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            const decodedToken = parseJwt(jwt);
            const userName = decodedToken.name || ''; 
            const email = decodedToken.email || ''; 

            
            
            document.getElementById('name-city').value = userName;
            document.getElementById('email-city').value = email;
        }
        popup.style.display = 'block';
    });

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
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'Please log in to make a booking.'
            });
            return;
        }

        const decodedToken = parseJwt(jwt);
        const userId = decodedToken.userId || decodedToken.sub;

        const bookingDate = new Date(date);
        var price = document.getElementById('price').textContent.trim(); // or .innerText

        // Calculate total amount based on number of guests and price
        const totalAmountFinal = parseInt(guests) * parseFloat(price);

        const urlParams = new URLSearchParams(window.location.search);
        const serviceId1 = parseInt(urlParams.get('id')); // Parse the service ID as an integer

        const bookingData = {
            userId: userId,
            serviceId: serviceId1,
            bookingDate: bookingDate,
            numberOfPeople: guests,
            totalAmount: totalAmountFinal,
            status: "pending",
            paymentStatus: ""
        };

        fetch('https://localhost:44321/api/Bookings/bookingtour', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(bookingData)
        })
            .then(response => {
                return response.json().then(data => {
                    if (!response.ok) {
                        throw new Error(data.message || 'Booking failed');
                    }
                    return data;
                });
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Successful',
                    text: 'Your booking will be displayed on the profile page.'
                });
                popup.style.display = 'none';
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed',
                    text: error.message || 'An unexpected error occurred. Please try again.'
                });
            });
    });

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Invalid JWT token.");
            return {};
        }
    }
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
                document.querySelector('.price').textContent = service.price + " jd per ticket";
                document.querySelector('.question').textContent = service.question;
                document.querySelector('#tour_name').textContent = service.serviceName;
                document.querySelector('#tour_price').textContent = service.price;



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




// Function to extract the serviceId from the URL
function getServiceIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');  // Get the 'id' parameter from the URL
}

// Fetch data for the specific service
function fetchServiceData(serviceId) {
    fetch(`https://localhost:44321/api/Services/${serviceId}`)
        .then(response => response.json())
        .then(service => {
            // Dynamically update the service name and price if data is valid
            if (service) {
                document.getElementById('bar_service_name').textContent = `Explore ${service.serviceName} today!`;
                document.getElementById('bar_button').textContent = `Book Now for ${service.price} jd`;
            } else {
                document.getElementById('bar_service_name').textContent = "Service not found";
            }
        })
        .catch(error => {
            console.error('Error fetching service data:', error);
            document.getElementById('bar_service_name').textContent = "Error loading service.";
        });
}

// Get the serviceId from the URL and fetch the service data
const serviceId = getServiceIdFromUrl();
if (serviceId) {
    fetchServiceData(serviceId);
} else {
    document.getElementById('bar_service_name').textContent = "No service ID provided.";
}


////////////////////////////////////// for chack the user id for booking button document.getElementById('open-popup').addEventListener('click', function() {







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







document.addEventListener('DOMContentLoaded', function () {
    var openPopupButton = document.getElementById('open-popup');
    var popup = document.getElementById('popup');
    var closePopupButton = document.getElementById('close-popup');
    var overlay = document.getElementById('overlay');

    function openPopup() {
        console.log("Opening popup");
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            console.log("No JWT found");
            return;
        }
        popup.style.display = 'block';
        overlay.style.display = 'block';
        setTimeout(() => {
            popup.classList.add('show');
            overlay.classList.add('show');
        }, 10);
    }

    function closePopup() {
        console.log("Closing popup");
        popup.classList.remove('show');
        overlay.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }

    openPopupButton.addEventListener('click', openPopup);

    closePopupButton.addEventListener('click', function () {
        var name = document.getElementById('name-city').value.trim();
        var email = document.getElementById('email-city').value.trim();
        var date = document.getElementById('date-city').value;
        var guests = document.getElementById('guests-city').value;
        
        // Validation checks
        if (name === "" || email === "" || date === "" || guests === "") {
            console.log("Validation failed: Empty fields");
            return;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            console.log("Validation failed: Invalid email");
            return;
        }

        if (guests <= 0) {
            console.log("Validation failed: Invalid number of guests");
            return;
        }

        closePopup();
    });

    overlay.addEventListener('click', closePopup);

    // Close popup when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            closePopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            closePopup();
        }
    });
});