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






