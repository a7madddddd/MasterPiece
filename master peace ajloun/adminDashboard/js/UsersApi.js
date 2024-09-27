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







document.addEventListener('DOMContentLoaded', function () {
    fetch('https://localhost:44321/api/Users')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('userTableBody');
            data.$values.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.userRole}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('userTableBody').innerHTML = '<tr><td colspan="6">Error loading data. Please try again later.</td></tr>';
        });
});










///////////////// search for users bookings 
async function fetchUserBookings() {
    const username = document.getElementById("usernameSearch").value;
    const response = await fetch(`https://localhost:44321/api/Users/user/username/${username}/bookings`);

    if (response.ok) {
        const data = await response.json();
        const bookings = data.$values; // Accessing the $values array
        populateTable(bookings);
    } else {
        document.getElementById("bookingsTableBody").innerHTML = '<tr><td colspan="4">No bookings found.</td></tr>';
    }
}


function populateTable(bookings) {
    const tableBody = document.getElementById("bookingsTableBody");
    tableBody.innerHTML = ''; // Clear existing data

    bookings.forEach((booking, index) => {
        const row = `<tr>
                        <th scope="row">${index + 1}</th>
                        <td>${booking.username}</td>  <!-- Use booking.username -->
                        <td>${booking.serviceName}</td> <!-- Add service name -->
                        <td>${new Date(booking.bookingDate).toLocaleDateString()}</td> <!-- Format booking date -->
                        <td>${booking.totalAmount}</td> <!-- Add service name -->
                        <td>${booking.numberOfPeople}</td> <!-- Add service name -->
                        <td>${booking.status}</td> <!-- Add service name -->
                    </tr>`;
        tableBody.innerHTML += row;
    });
}


///////// add users 
async function addUsersss() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value || "User"; // Default role

    const registerDto = {
        username: username,
        email: email,
        password: password,
    };

    try {
        const response = await fetch('https://localhost:44321/api/Users/Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerDto),
        });

        if (response.ok) {
            const result = await response.json();
            showToast(result.message || "User added successfully!", "success"); // Use toast for success
            clearForm();
        } else {
            const errorText = await response.text();
            showToast(errorText || "Error adding user.", "error"); // Use toast for error
        }
    } catch (error) {
        showToast("Error adding user: " + error.message, "error"); // Use toast for error
    }
}

function clearForm() {
    document.getElementById("username").value = '';
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';
    document.getElementById("role").value = '';
}