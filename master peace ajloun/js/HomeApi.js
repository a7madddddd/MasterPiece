document.addEventListener('DOMContentLoaded', function () {
    fetch('https://localhost:44321/api/Services/most')
        .then(response => response.json())
        .then(data => {
            // Check if the data contains the $values property
            const services = data.$values ? data.$values : data;

            const servicesContainer = document.getElementById('services-container');
            servicesContainer.innerHTML = ''; // Clear existing content

            services.forEach((service, index) => {
                // Create a new blog item for each service
                const blogItem = document.createElement('div');
                blogItem.className = 'col-lg-4 wow fadeInUp';
                blogItem.setAttribute('data-wow-delay', `${0.2 * (index + 1)}s`);

                blogItem.innerHTML = `
                    <div class="blog-item">
                        <div class="blog-img">
                            <a href="#">
                                <img src="${service.image}" class="img-fluid w-100 rounded-top" alt="Image" style="width: 100%; height: 30vh;">
                            </a>
                            <div class="blog-category py-2 px-4">Most Booked</div>
                            <div class="blog-date"><i class="fas fa-clock me-2"></i>${service.dates}</div>
                        </div>
                        <div class="blog-content p-4">
                            <a href="#" class="h4 d-inline-block mb-4">${service.question}</a>
                            <p class="mb-4">${service.description}</p>
                            <a href="service-details.html?id=${service.serviceId}" class="read-more2 rounded-pill py-2 px-4">Explore.. <i class="fas fa-arrow-right ms-2"></i></a>
                        </div>
                    </div>
                `;
                servicesContainer.appendChild(blogItem);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});


/////////////////////////////////////////////////////


// Fetch the data from the API
// Fetch the data from the API
// Function to safely update an element's text content
function safelyUpdateElement(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
        console.log(`Updated ${selector} with value: ${value}`);
    } else {
        console.warn(`Element not found: ${selector}. Skipping update.`);
    }
    return element;
}

// Function to fetch and update tourism statistics
function fetchTourismStatistics() {
    fetch('https://localhost:44321/api/TourismStatistics')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Check for the $values key and data array
            const statisticsArray = data.$values;
            if (!Array.isArray(statisticsArray) || statisticsArray.length === 0) {
                throw new Error('No data received from the API');
            }

            // Assuming we're interested in the first set of statistics
            const statistics = statisticsArray[0];

            // Update elements with statistics data
            safelyUpdateElement('#clients', statistics.clients);
            safelyUpdateElement('#clientsChangePercentage', `${statistics.clientsChangePercentage}%`);
            safelyUpdateElement('#returningClients', statistics.returningClients);
            safelyUpdateElement('#returningClientsChangePercentage', `${statistics.returningClientsChangePercentage}%`);
            safelyUpdateElement('#reservations', statistics.reservations);
            safelyUpdateElement('#reservationsChangePercentage', `${statistics.reservationsChangePercentage}%`);
            safelyUpdateElement('#items', statistics.items);
            safelyUpdateElement('#itemsChangePercentage', `${statistics.itemsChangePercentage}%`);
            safelyUpdateElement('#awards', statistics.awwards);
            safelyUpdateElement('#days', statistics.days);
            safelyUpdateElement('#duration', statistics.duration);

            console.log('Tourism statistics updated successfully');
        })
        .catch(error => {
            console.error('Error fetching or processing tourism statistics:', error);
        });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchTourismStatistics);



/////////////////////////////////////////////////////
// Function to safely update an element's text content
// Function to safely update an element's text content
function safelyUpdateElement(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
        console.log(`Updated ${selector} with value: ${value}`);
    } else {
        console.warn(`Element not found: ${selector}. Skipping update.`);
    }
    return element;
}

// Function to safely update an element's text content
function safelyUpdateElement(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
        console.log(`Updated ${selector} with value: ${value}`);
    } else {
        console.warn(`Element not found: ${selector}. Skipping update.`);
    }
    return element;
}

function fetchOpeningHours() {
    fetch('https://localhost:44321/api/TourismStatistics')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Check if the response contains the expected $values key and it's an array
            const schedules = data.$values;
            if (!Array.isArray(schedules) || schedules.length === 0) {
                throw new Error('No data received from the API');
            }

            // Iterate through the schedules array and update each row
            schedules.forEach((schedule, index) => {
                if (schedule.days && schedule.duration) {
                    const rowIndex = index + 1; // CSS nth-child is 1-indexed
                    safelyUpdateElement(`.service-days .py-2:nth-child(${rowIndex}) h4`, schedule.days);
                    safelyUpdateElement(`.service-days .py-2:nth-child(${rowIndex}) p`, schedule.duration);
                }
            });

            console.log('Opening hours updated successfully');
        })
        .catch(error => {
            console.error('Error fetching or processing opening hours:', error);
        });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchOpeningHours);


///// function to display the user name from api 
document.addEventListener('DOMContentLoaded', function () {
    // Assuming JWT token is stored in localStorage
    const jwt = localStorage.getItem('jwt');
    const loadingText = document.querySelector('.loading-text');

    if (jwt) {
        // Extract user ID from JWT (if you need it)
        const decodedToken = parseJwt(jwt);
        const userId = decodedToken.userId || decodedToken.sub;

        // Fetch user details
        fetch(`https://localhost:44321/api/Users/${userId}`, {
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
            .then(user => {
                // Update the loading text with the user's first name
                loadingText.textContent = `Welcome ${user.firstName} ...`;
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // Set loading text to "Guest" if there is an error (e.g., user not logged in)
                loadingText.textContent = 'Welcome Guest ...';
            });
    } else {
        // If no JWT is present, set loading text to "Guest"
        loadingText.textContent = 'Welcome Guest ...';
    }

    // Function to parse JWT
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
});
