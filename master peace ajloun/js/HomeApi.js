document.addEventListener('DOMContentLoaded', function () {
    fetch('https://localhost:44321/api/Services/most')
        .then(response => response.json())
        .then(data => {

            const services = data.$values ? data.$values : data;

            const servicesContainer = document.getElementById('services-container');
            servicesContainer.innerHTML = ''; 

            services.forEach((service, index) => {
               
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

function fetchTourismStatistics() {
    fetch('https://localhost:44321/api/TourismStatistics')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            
            const statisticsArray = data.$values;
            if (!Array.isArray(statisticsArray) || statisticsArray.length === 0) {
                throw new Error('No data received from the API');
            }
            const statistics = statisticsArray[0];

            // Update 
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

document.addEventListener('DOMContentLoaded', fetchTourismStatistics);



// fetch Opening Hours
function fetchOpeningHours() {
    fetch('https://localhost:44321/api/TourismStatistics')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
           
            const schedules = data.$values;
            if (!Array.isArray(schedules) || schedules.length === 0) {
                throw new Error('No data received from the API');
            }

           
            schedules.forEach((schedule, index) => {
                if (schedule.days && schedule.duration) {
                    const rowIndex = index + 1; 
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

document.addEventListener('DOMContentLoaded', fetchOpeningHours);




/////display name in loader
document.addEventListener('DOMContentLoaded', function () {
    
    const jwt = localStorage.getItem('jwt');
    const loadingText = document.querySelector('.loading-text');

    if (jwt) {
       
        const decodedToken = parseJwt(jwt);
        const userId = decodedToken.userId || decodedToken.sub;

       
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
                
                loadingText.textContent = `Welcome ${user.firstName} ...`;
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                
                loadingText.textContent = 'Welcome Guest ...';
            });
    } else {
       
        loadingText.textContent = 'Welcome Guest ...';
    }

   
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
















document.addEventListener('DOMContentLoaded', function () {
    
    async function fetchServices() {
        try {
            const response = await fetch('https://localhost:44321/api/Services');
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Services data:", data);

            
            if (data && Array.isArray(data.$values)) {
                return data.$values; 
            } else {
                console.error("Expected an array but got:", data);
                return [];  
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            return []; 
        }
    }

    
    function displayServices(services) {
        const resultsContainer = document.getElementById('serviceResults');
        resultsContainer.innerHTML = ''; // Clear previous results

        if (Array.isArray(services)) {
            services.forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'service-card';
                serviceCard.innerHTML = `
                    <img src="${service.image}" alt="${service.serviceName}">
                    <h3>${service.serviceName}</h3>
                    <p>${service.description}</p>
                    <h4>Price: ${service.price} jd</h4>
                    <a href="/service-details.html?id=${service.serviceId}">Explore</a>
                `;
                resultsContainer.appendChild(serviceCard);
            });
        } else {
            console.error("displayServices expected an array, but got:", services);
        }
    }

    // Function to handle search and open modal
    async function handleSearch(event) {
        event.preventDefault();

        // Fetch services after search
        const services = await fetchServices();

        // Check if services is an array before filtering
        if (Array.isArray(services)) {
            // Get search criteria from the form inputs
            const destination = document.querySelector('.destination.search_input').value.toLowerCase();
            const checkIn = document.querySelector('.check_in.search_input').value;
            const checkOut = document.querySelector('.check_out.search_input').value;

            // Filter services based on search criteria (case-insensitive)
            const filteredServices = services.filter(service =>
                service.serviceName.toLowerCase().includes(destination) ||
                service.description.toLowerCase().includes(destination)
            );

            // If matches found, display them in the modal
            if (filteredServices.length > 0) {
                displayServices(filteredServices);  // Display only filtered services
                openModal(); // Open the modal
            } else {
                alert('No matching services found. Please try a different search.');
            }
        } else {
            console.error("handleSearch expected an array but got:", services);
        }
    }

    // Function to open the modal
    function openModal() {
        const modal = document.getElementById('serviceModal');
        modal.style.display = 'block'; 
    }

    // Function to close the modal
    function closeModal() {
        const modal = document.getElementById('serviceModal');
        modal.style.display = 'none'; // Hide the modal
    }

    // Add event listener to the search button
    const searchButton = document.querySelector('.search_button');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    } else {
        console.error("Search button not found");
    }

    // Add event listener to the close button
    const closeButton = document.querySelector('.modal .close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    } else {
        console.error("Close button not found");
    }

    // Close the modal if the user clicks outside of the modal content
    window.onclick = function (event) {
        const modal = document.getElementById('serviceModal');
        if (event.target === modal) {
            closeModal();
        }
    };
});
