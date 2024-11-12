// Truncate text to the first 10 characters
function truncateText(text, length = 20) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

// Fetch offers data and display them in the offers table
fetch('https://localhost:44321/api/Offers/AllOffers')
    .then(response => response.json())
    .then(data => {
        // Access the $values array which holds the actual offer objects
        const offersArray = data.values.$values;

        // Check if offersArray is an array and has elements
        if (!Array.isArray(offersArray) || offersArray.length === 0) {
            console.error('No offers data received from the API');
            return;
        }

        // Get the table body where offers will be displayed
        const tableBody = document.querySelector('#servicesTable tbody');
        if (!tableBody) {
            console.error('Table body element not found');
            return;
        }

        // Clear the table body before adding new content
        tableBody.innerHTML = '';

        // Iterate over each offer and create the table row content
        offersArray.forEach((offer, index) => {
            const rowHTML = `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${offer.serviceName || 'N/A'}</td>
                    <td class="description-cell">
                        ${truncateText(offer.description || 'No description available', 20)}
                    </td>
                    <td>${offer.discountPercentage || 0}%</td>
                    <td>${offer.isActive ? 'Yes' : 'No'}</td>
                    <td>${offer.startDate || 'N/A'}</td>
                    <td>${offer.endDate || 'N/A'}</td>
                    <td>${offer.pricePerNight || 0} jd</td>
                    <td>${offer.rating || 'N/A'}</td>
                </tr>
            `;

            // Append each row to the table body
            tableBody.innerHTML += rowHTML;
        });

        console.log('Offers table populated successfully');
    })
    .catch(error => {
        console.error('Error fetching the offers:', error);
    });








//////////////////// add offers function //
// Fetch services from the API and populate the dropdown
// Fetch services and populate the dropdown
// Define fillFormFields to populate form fields with selected service data
function fillFormFields(selectedService) {
    document.getElementById('serviceName').value = selectedService.serviceName || '';
    document.getElementById('discountPercentage').value = selectedService.discountPercentage || '';
    // Add other fields as needed, matching field names with your form
}

// Fetch services and populate the dropdown
(async function () {
    try {
        const response = await fetch('https://localhost:44321/api/Services');
        if (!response.ok) {
            throw new Error('Failed to fetch services');
        }

        const responseData = await response.json();
        const services = responseData.$values;
        const serviceDropdown = document.getElementById('Servicename');

        serviceDropdown.innerHTML = '<option value="">Select a Service</option>';

        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.serviceName; // Set the value to the service name
            option.text = service.serviceName; // Set the display text to the service name
            option.dataset.service = JSON.stringify(service); // Store the entire service object
            serviceDropdown.appendChild(option);
        });

        // Handle selection change to fill form fields
        serviceDropdown.addEventListener('change', function () {
            const selectedOption = serviceDropdown.options[serviceDropdown.selectedIndex];
            if (selectedOption.value) {
                const selectedService = JSON.parse(selectedOption.dataset.service);
                fillFormFields(selectedService);
            }
        });

    } catch (error) {
        console.error('Error loading services:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error loading services: ' + error.message,
        });
    }
})();

// Handle form submission with SweetAlert feedback
document.getElementById('OffersForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const serviceName = document.getElementById('Servicename').selectedOptions[0].text;
    const discountPercentage = parseFloat(document.getElementById('discountPercentage').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const isActive = true; // Set active status if applicable

    const offer = { serviceName, discountPercentage, isActive, startDate, endDate };

    // Send the POST request to create the offer
    fetch('https://localhost:44321/api/Offers/AddOfferByServiceName', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(offer)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    console.error('API Error:', err);
                    throw new Error(`Failed to create offer: ${JSON.stringify(err)}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data && data.offerId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Offer Added',
                    text: `Offer added successfully. Offer End in : ${data.endDate}`,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to add offer',
                    text: 'Invalid response data',
                });
            }
        })
        .catch(error => {
            console.error('Error submitting offer:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error submitting offer: ' + error.message,
            });
        });
});














// Function to fill in form fields dynamically with selected service
function fillFormFields(selectedService) {
    // Set the values of the form fields to the selected service details
    document.getElementById('servicename2').value = selectedService.serviceName || '';
    document.getElementById('discountPercentage2').value = selectedService.discountPercentage || '';
    document.getElementById('startDate2').value = selectedService.startDate ? selectedService.startDate.split('T')[0] : ''; // Format date as YYYY-MM-DD
    document.getElementById('endDate2').value = selectedService.endDate ? selectedService.endDate.split('T')[0] : ''; // Format date as YYYY-MM-DD
    document.getElementById('isActive').checked = selectedService.isActive || false;
}

// Fetch services and populate the dropdown
(async function () {
    try {
        const response = await fetch('https://localhost:44321/api/Offers/GetOffersbyservicename');
        if (!response.ok) {
            throw new Error('Failed to fetch services');
        }

        const responseData = await response.json();
        const services = responseData.$values;  // Array of services from API
        const serviceDropdown = document.getElementById('servicename2');

        // Clear the dropdown before populating it
        serviceDropdown.innerHTML = '<option value="">Select a Service</option>';

        // Populate dropdown with options
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.serviceName;  // Use serviceName as value
            option.text = service.serviceName;   // Display serviceName as text
            option.dataset.service = JSON.stringify(service); // Store the entire service object in the option's data attribute
            serviceDropdown.appendChild(option);
        });

        // Add an event listener to handle change event
        serviceDropdown.addEventListener('change', function () {
            const selectedOption = serviceDropdown.options[serviceDropdown.selectedIndex];
            if (selectedOption.value) {
                const selectedService = JSON.parse(selectedOption.dataset.service); // Retrieve service object
                fillFormFields(selectedService); // Fill the form fields with selected service details
            }
        });

    } catch (error) {
        console.error('Error loading services:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error loading services: ' + error.message,
        });
    }
})();


// Handle form submission for updating an offer
document.getElementById('updateServiceForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const serviceName = document.getElementById('servicename2').selectedOptions[0].text;
    const discountPercentage = parseFloat(document.getElementById('discountPercentage2').value);
    const startDate = document.getElementById('startDate2').value;
    const endDate = document.getElementById('endDate2').value;
    const isActive = document.getElementById('isActive').checked;

    const offer = { serviceName, discountPercentage, startDate, endDate, isActive };

    try {
        const response = await fetch('https://localhost:44321/api/Offers/UpdateOfferByServiceName', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(offer)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update offer');
        }

        const result = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Offer Updated',
            text: `Offer for ${result.ServiceName} has been successfully updated!`
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: error.message
        });
    }
});

// Handle delete button click
document.getElementById('deleteOffersButton').addEventListener('click', async function () {
    const serviceName = document.getElementById('servicename2').selectedOptions[0].text;

    const confirmation = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: `Do you want to delete the offer for ${serviceName}?`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (confirmation.isConfirmed) {
        try {
            const response = await fetch(`https://localhost:44321/api/Offers/DeleteOfferByServiceName?serviceName=${serviceName}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete offer');
            }

            Swal.fire({
                icon: 'success',
                title: 'Offer Deleted',
                text: `The offer for ${serviceName} has been deleted.`
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: error.message
            });
        }
    }
});
