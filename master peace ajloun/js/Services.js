

function parseJwt(token) {

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');


    const jsonPayload = decodeURIComponent(escape(window.atob(base64)));
    return JSON.parse(jsonPayload);
}



// const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZCIsImVtYWlsIjoiaHJfbWFuYWdlckBvdXRsb29rLmNvbSIsImp0aSI6IjYyZTAzZGY3LWFkZDYtNDNiYS04MmEwLTVmMzg2MWVkMGU2NSIsImV4cCI6MTcyNjg4MDc5MywiaXNzIjoieW91cklzc3VlciIsImF1ZCI6InlvdXJBdWRpZW5jZSJ9.uHiTy3srFbcMvZcx0za11gia5FFBCO2bIZQ9IMgtAN4';

// const decodedToken = parseJwt(jwt);
// const userId = decodedToken.sub || decodedToken.userId; 
// if (userId != 0 && null) {

//     alert('User ID:', userId);
// }




// Fetch services
fetch('https://localhost:44321/api/Services')
    .then(response => response.json())
    .then(data => {
        // access to values
        const servicesArray = data.$values;


        if (!Array.isArray(servicesArray) || servicesArray.length === 0) {
            throw new Error('No services data received from the API');
        }


        const servicesContainer = document.getElementById('services-container');
        if (!servicesContainer) {
            console.error('Services container element not found');
            return;
        }


        servicesContainer.innerHTML = '';


        servicesArray.forEach(service => {
            if (service.isActive) {
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


                servicesContainer.innerHTML += cardHTML;
            }
        });

        console.log('Services loaded successfully');

        // for all book buttons
        document.querySelectorAll('.book-button').forEach(button => {
            button.addEventListener('click', function () {
                const serviceName = this.textContent;
                const serviceId = this.getAttribute('data-service-id');
                const serviceImage = this.getAttribute('data-image');

                document.getElementById('service-title').textContent = serviceName;
                document.getElementById('open-popup').setAttribute('data-service-id', serviceId);
                document.getElementById('open-popup').setAttribute('data-service', serviceName);
                document.getElementById('open-popup').setAttribute('data-image', serviceImage);

                document.getElementById('popup').style.display = 'block';
            });
        });

        console.log('Services loaded successfully');
    })
    .catch(error => {
        console.error('Error fetching the services:', error);
    });





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


//close popup 

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
        var price = document.getElementById('price').textContent.trim();

        // total amount 
        const totalAmountFinal = parseInt(guests) * parseFloat(price);

        const urlParams = new URLSearchParams(window.location.search);
        const serviceId1 = parseInt(urlParams.get('id')); // service id

        const bookingData = {
            userId: userId,
            serviceId: serviceId1,
            bookingDate: bookingDate,
            numberOfPeople: guests,
            totalAmount: totalAmountFinal,
            status: "pending",
            paymentStatus: "pending"
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



// validations
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}





















////////////////display service details 
document.addEventListener('DOMContentLoaded', function () {


    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');



    if (serviceId) {

        fetch(`https://localhost:44321/api/Services/${serviceId}`)
            .then(response => response.json())
            .then(service => {

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


//////////////////// proposal 
function loadProposalServices() {
    fetch('https://localhost:44321/api/Services')
        .then(response => response.json())
        .then(data => {

            const servicesArray = data.$values;
            if (!Array.isArray(servicesArray) || servicesArray.length === 0) {
                throw new Error('No services data received from the API');
            }

            const proposalContainer = document.querySelector('.scontainer_container');
            if (!proposalContainer) {
                console.error('Proposal container element not found');
                return;
            }

            proposalContainer.innerHTML = '';


            const shuffledServices = servicesArray.sort(() => 0.5 - Math.random());

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

document.addEventListener('DOMContentLoaded', loadProposalServices);

///////////////////////////// for explain button
function getServiceIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');  // Get the 'id' parameter from the URL
}

// Fetch data for the specific service
function fetchServiceData(serviceId) {
    fetch(`https://localhost:44321/api/Services/${serviceId}`)
        .then(response => response.json())
        .then(service => {
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

const serviceId = getServiceIdFromUrl();
if (serviceId) {
    fetchServiceData(serviceId);
} else {
    document.getElementById('bar_service_name').textContent = "No service ID provided.";
}


////////////////////////////////////// for chack the user id for booking button document.getElementById('open-popup').addEventListener('click', function() {













document.addEventListener('DOMContentLoaded', function () {
    var openPopupButton = document.getElementById('open-popup');
    var popup = document.getElementById('popup');
    var closePopupButton = document.getElementById('close-popup');
    var overlay = document.getElementById('overlay');

    function openPopup() {
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

    // clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            closePopup();
        }
    });

    // Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            closePopup();
        }
    });
});