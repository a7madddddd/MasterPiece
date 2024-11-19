function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.backgroundColor = type === 'success' ? 'green' : 'red';
    toast.style.display = 'block';

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}



// Ensure the function is globally accessible
// Service form submission
document.getElementById('serviceForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const serviceName = document.getElementById('ServiceName').value;
    const description = document.getElementById('Description').value;
    const price = document.getElementById('Price').value;
    const description2 = document.getElementById('Description2').value;
    const question = document.getElementById('Question').value;

    const isActiveRadio = document.querySelector('input[name="isActive"]:checked');
    if (!isActiveRadio) {
        showToast('Please select whether the service is active or not.', 'error');
        return;
    }

    if (!serviceName || !description || !price || !description2 || !question) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('ServiceName', serviceName);
    formData.append('Description', description);
    formData.append('Price', price);
    formData.append('Description2', description2);
    formData.append('Question', question);
    formData.append('IsActive', isActiveRadio.value === 'true');

    const dateInput = document.getElementById('Dates').value;
    if (dateInput) {
        const formattedDate = new Date(dateInput).toISOString().split('T')[0];
        formData.append('Dates', formattedDate);
    }

    const imageFile = document.getElementById('ImageFile').files[0];
    if (imageFile) {
        formData.append('ImageFile', imageFile);
    }

    try {
        const response = await fetch('https://localhost:44321/api/Services/Dahboard Add Service', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText} - ${errorDetails}`);
        }

        const result = await response.json();
        console.log('Service added:', result);
        showToast('Service added successfully!', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to add service. Please try again.', 'error');
    }
});

///////////////////////



function showToast(message, type) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; // Add a class for styling
    toast.innerText = message;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000); // Toast disappears after 3 seconds
}

async function loadServices() {
    try {
        const response = await fetch('https://localhost:44321/api/Services');
        if (!response.ok) {
            throw new Error('Failed to fetch services');
        }

        const responseData = await response.json();
        const services = responseData.$values;
        const serviceDropdown = document.getElementById('serviceName');

        serviceDropdown.innerHTML = '<option value="">Select a Service</option>';

        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.serviceName; 
            option.text = service.serviceName;
            option.dataset.service = JSON.stringify(service);
            serviceDropdown.appendChild(option);
        });

        serviceDropdown.addEventListener('change', function () {
            const selectedOption = serviceDropdown.options[serviceDropdown.selectedIndex];
            if (selectedOption.value) {
                const selectedService = JSON.parse(selectedOption.dataset.service);
                fillFormFields(selectedService);
            }
        });

    } catch (error) {
        console.error('Error loading services:', error);
        showToast('Error loading services: ' + error.message, 'error');
    }
}

function fillFormFields(service) {
    document.getElementById('description').value = service.description || '';
    document.getElementById('price').value = service.price || '';
    document.getElementById('description2').value = service.description2 || '';
    document.getElementById('question').value = service.question || '';
    document.getElementById('isActive').checked = service.isActive || false;

    if (service.dates) {
        const date = new Date(service.dates);
        document.getElementById('dates').value = date.toISOString().split('T')[0];
    }

    // Update image source path
    if (service.image) {
        document.getElementById('imagePreview').src = `../${service.image}`; 
        document.getElementById('imagePreview').style.display = 'block';
    } else {
        document.getElementById('imagePreview').style.display = 'none';
    }
}

document.getElementById('imageFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('imagePreview');
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('updateServiceForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData();
    const serviceName = document.getElementById('serviceName').value;

    if (!serviceName) {
        showToast('Please select a service to update.', 'error');
        return;
    }

    formData.append('ServiceName', serviceName);
    formData.append('Description', document.getElementById('description').value);

    const priceValue = parseFloat(document.getElementById('price').value);
    if (isNaN(priceValue) || priceValue <= 0) {
        showToast('Please enter a valid price.', 'error');
        return;
    }
    formData.append('Price', priceValue);
    formData.append('Description2', document.getElementById('description2').value);
    formData.append('Question', document.getElementById('question').value);
    formData.append('IsActive', document.getElementById('isActive').checked);

    const dateInput = document.getElementById('Dates').value;
    if (dateInput) {
        const dateObj = new Date(dateInput);
        if (!isNaN(dateObj)) { // Ensure the date is valid
            formData.append('Dates[year]', dateObj.getFullYear());
            formData.append('Dates[month]', dateObj.getMonth() + 1);
            formData.append('Dates[day]', dateObj.getDate());
            formData.append('Dates[dayOfWeek]', dateObj.getDay());
        } else {
            console.error("Invalid date format");
        }
    } else {
        console.warn("Date input is empty");
    }

    const imageFile = document.getElementById('imageFile').files[0];
    if (imageFile) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validImageTypes.includes(imageFile.type)) {
            showToast('Please upload a valid image file (JPEG, PNG, or GIF).', 'error');
            return;
        }
        formData.append('ImageFile', imageFile);
    }

    try {
        const response = await fetch('https://localhost:44321/api/Services/UpdateServiceByName', {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText} - ${errorDetails}`);
        }

        const result = await response.json();
        console.log('Service updated:', result);
        showToast('Service updated successfully!', 'success');

        document.getElementById('updateServiceForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
        loadServices(); 

    } catch (error) {
        console.error('Error:', error.message);
        showToast('Failed to update service. Please try again.', 'error');
    }
});

// Load services when the page is loaded
document.addEventListener('DOMContentLoaded', loadServices);













document.getElementById('deleteServiceBtn').addEventListener('click', async function () {
    const serviceName = document.getElementById('serviceName').value;
    if (!serviceName) {
        showToast('Please enter a service name to delete', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete the service "${serviceName}"?`)) {
        try {
            const response = await fetch(`https://localhost:44321/api/Services/DeleteService/${encodeURIComponent(serviceName)}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Network response was not ok: ${response.statusText} - ${errorDetails}`);
            }

            showToast('Service deleted successfully!', 'success');
            document.getElementById('updateServiceForm').reset();
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to delete service. Please try again.', 'error');
        }
    }
});








///////////////////



async function fetchServices() {
    try {
        const response = await fetch('https://localhost:44321/api/Services');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const services = data.$values;

        const tableBody = document.getElementById('servicesTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing data

        services.forEach((service, index) => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${service.serviceName}</td>
                <td>${service.description}</td>
                <td>${service.dates}</td>
                <td>${service.price}</td>
                <td>${service.isActive ? 'Yes' : 'No'}</td>
               
            `;
        });
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

// Call the fetchServices function on page load
document.addEventListener('DOMContentLoaded', fetchServices);















// Function to update UI with user data
// Function to get JWT from local storage
function getJWTFromLocalStorage() {
    return localStorage.getItem('jwt');
}

// Function to decode JWT token
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

// Function to fetch user data
async function fetchUserData(userId) {
    try {
        const response = await fetch(`https://localhost:44321/api/Users/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

// Function to update UI with user data
function updateUI(userData) {
    if (!userData) {
        console.error('No user data available to update UI');
        return;
    }
    document.getElementById('userName').textContent = userData.username || 'N/A';
    document.getElementById('userRole').textContent = userData.userRole || 'N/A';
    document.getElementById('userFullName').textContent = `${userData.firstName} ${userData.lastName}` || 'N/A';

    if (userData.profileImage) {
        document.getElementById('userImage').src = '../../' + userData.profileImage;
        document.getElementById('userImage1').src = '../../' + userData.profileImage;


    }
}

// Function to display error message in UI
function displayError(message) {
    document.getElementById('userName').textContent = 'Error';
    document.getElementById('userRole').textContent = 'Error';
    document.getElementById('userFullName').textContent = 'Error';
    console.error(message);
}

// Main function to initialize the page
async function initializePage() {
    try {
        const jwtToken = getJWTFromLocalStorage();

        if (!jwtToken) {
            displayError('No JWT found in local storage. Please log in.');
            return;
        }

        const decodedToken = decodeJWT(jwtToken);
        if (decodedToken && decodedToken.userId) {
            const userData = await fetchUserData(decodedToken.userId);
            if (userData) {
                updateUI(userData);
            } else {
                displayError('Failed to fetch user data');
            }
        } else {
            displayError('Invalid or missing user ID in JWT');
        }
    } catch (error) {
        displayError(`Failed to initialize: ${error.message}`);
    }
}

// Call the initialization function when the page loads
window.addEventListener('load', initializePage);
