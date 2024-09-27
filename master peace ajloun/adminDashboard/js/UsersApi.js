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










/////////////////
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
