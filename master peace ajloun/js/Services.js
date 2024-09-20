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
                            <a href="service-details.html?id=${service.serviceId}" class="h4 d-inline-block mb-4">
                                ${service.question}
                            </a>
                            <p class="mb-4">${service.description}</p>
                            <a href="service-details.html?id=${service.serviceId}" class="btn btn-primary rounded-pill py-2 px-4">Read More <i class="fas fa-arrow-right ms-2"></i></a>
                            <button class="btn btn-success rounded-pill py-2 px-4 mt-3 book-button" data-service="${service.serviceName}" data-service-id="${service.serviceId}" data-image="${service.image}">Book Now</button>
                        </div>
                    </div>
                </div>
            `;
            // Append each card to the container
            servicesContainer.innerHTML += cardHTML;
        });

        // Add event listeners to all "Book Now" buttons
        document.querySelectorAll('.book-button').forEach(button => {
            button.addEventListener('click', function () {
                // Get service details from the button's data attributes
                const serviceName = this.getAttribute('data-service');
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
document.addEventListener('DOMContentLoaded', function () {
    var closePopupButton = document.getElementById('close-popup');
    var popup = document.getElementById('popup');

    closePopupButton.addEventListener('click', function () {
        // Validate form inputs
        var name = document.getElementById('name-city').value.trim();
        var email = document.getElementById('email-city').value.trim();
        var date = document.getElementById('date-city').value;
        var guests = document.getElementById('guests-city').value;

        // Check if any field is empty
        if (name === "" || email === "" || date === "" || guests === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields before submitting the booking.'
            });
            return; // Stop further execution if validation fails
        }

        // Validate email format
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a valid email address.'
            });
            return; // Stop further execution if email is invalid
        }

        // Validate number of guests
        if (guests <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a valid number of guests.'
            });
            return; // Stop further execution if the number of guests is invalid
        }

        // If all validations pass, proceed to send the booking data to the server
        var serviceId = document.getElementById('open-popup').getAttribute("data-service-id");
        const jwt = localStorage.getItem('jwt'); // Get JWT from local storage

        const bookingData = {
            userId: userId, // Replace with dynamic user ID if available in the system
            serviceId: parseInt(serviceId),
            bookingDate: date,
            numberOfPeople: parseInt(guests),
            totalAmount: parseInt(guests) * 10, // Assuming a fixed price per person
            status: 'pending'
        };

        fetch('https://localhost:44321/api/Bookings/booking tour', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}` // Send JWT in the authorization header
            },
            body: JSON.stringify(bookingData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error during booking process.');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Successful',
                    text: 'Your booking will be displayed on the profile page.'
                });

                // Hide the popup
                popup.style.display = 'none';
                console.log('Booking data:', data);
            })
            .catch(error => {
                console.error('Error during booking process:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed',
                    text: 'An error occurred while processing your booking. Please try again later.'
                });
            });
    });
});











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






///////////////////////////////////////
