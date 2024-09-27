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








////// update 
document.getElementById('updateServiceForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData();
    formData.append('ServiceName', document.getElementById('serviceName').value);
    formData.append('Description', document.getElementById('description').value);
    formData.append('Price', document.getElementById('price').value);
    formData.append('Description2', document.getElementById('description2').value);
    formData.append('Question', document.getElementById('question').value);
    formData.append('IsActive', document.getElementById('isActive').checked);

    const dateInput = document.getElementById('dates').value;
    if (dateInput) {
        const formattedDate = new Date(dateInput).toISOString().split('T')[0];
        formData.append('Dates', formattedDate);
    }

    const imageFile = document.getElementById('imageFile').files[0];
    if (imageFile) {
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
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to update service. Please try again.', 'error');
    }
});

// Add event listener for delete button
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

// Note: Make sure the showToast function is defined once in your main JavaScript file
// and not duplicated in each form handler.








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



///////////////// add offer
let selectedServiceName = '';

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchServiceButton');
    const offerForm = document.getElementById('offerForm');

    searchButton.addEventListener('click', searchService);
    offerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addOffer();
    });
});

async function searchService() {
    const serviceNameInput = document.getElementById("serviceNameSearch");
    const serviceName = serviceNameInput.value.trim();

    if (!serviceName) {
        alert("Please enter a service name to search.");
        return;
    }

    try {
        const response = await fetch(`https://localhost:44321/api/Services/searchServiceByName?serviceName=${encodeURIComponent(serviceName)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const services = await response.json();
        if (services.length > 0) {
            selectedServiceName = services[0].serviceName;
            document.getElementById("selectedServiceInfo").innerText = `${services[0].serviceName} (ID: ${services[0].serviceId})`;
            document.getElementById("serviceDetails").style.display = "block";
            document.getElementById("offerForm").style.display = "block";
        } else {
            throw new Error("Service not found!");
        }
    } catch (error) {
        alert(error.message);
        document.getElementById("serviceDetails").style.display = "none";
        document.getElementById("offerForm").style.display = "none";
        selectedServiceName = '';
    }
}

async function addOffer() {
    if (!selectedServiceName) {
        alert("Please select a service first.");
        return;
    }

    const offerData = {
        serviceName: selectedServiceName,
        description: document.getElementById("Description").value,
        imageUrl: document.getElementById("imageUrl").value,
        pricePerTour: parseFloat(document.getElementById("pricePerTour").value),
        discountPercentage: parseFloat(document.getElementById("discountPercentage").value),
        isActive: document.getElementById("isActive").checked,
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value
    };

    try {
        const response = await fetch('https://localhost:44321/api/Offers/AddOfferByServiceName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(offerData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        alert("Offer added successfully!");
        console.log("Added offer:", result);

        // Reset form and hide it
        document.getElementById("offerForm").reset();
        document.getElementById("offerForm").style.display = "none";
        document.getElementById("serviceDetails").style.display = "none";
        document.getElementById("serviceNameSearch").value = "";
        selectedServiceName = '';
    } catch (error) {
        alert(`Failed to add offer: ${error.message}`);
    }
}
