async function fetchBookings() {
    try {
        const response = await fetch('https://localhost:44321/api/Bookings/UserBookingsDashboard');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error("Could not fetch bookings:", error);
    }
}

async function updateBookingStatus(bookingId, status) {
    try {
        const response = await fetch(`https://localhost:44321/api/Bookings/UpdateStatus/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not update booking status: ${error}`);
    }
}

async function deleteBooking(bookingId) {
    try {
        const response = await fetch(`https://localhost:44321/api/Bookings/Delete/${bookingId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not delete booking: ${error}`);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById('bookingsTableBody');
    tableBody.innerHTML = '';

    const bookings = data.$values || [];

    if (bookings.length === 0) {
        console.error('No bookings data found in the response');
        return;
    }

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input class="form-check-input" type="checkbox"></td>
            <td>${booking.bookingId || 'N/A'}</td>
            <td>${booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</td>
            <td>${booking.serviceName || 'N/A'}</td>
            <td>${booking.username || 'N/A'}</td>
            <td>${booking.numberOfPeople || 'N/A'}</td>
            <td>$${(booking.totalAmount || 0).toFixed(2)}</td>
            <td>${booking.status || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${booking.bookingId}">Delete</button>
                <button class="btn btn-sm btn-warning reject-btn" data-id="${booking.bookingId}">Reject</button>
                <button class="btn btn-sm btn-success accept-btn" data-id="${booking.bookingId}">Accept</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for the new buttons
    addButtonListeners();
}

function addButtonListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const bookingId = e.target.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this booking?')) {
                await deleteBooking(bookingId);
                initTable(); // Refresh the table
            }
        });
    });

    document.querySelectorAll('.reject-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const bookingId = e.target.getAttribute('data-id');
            await updateBookingStatus(bookingId, 'Rejected');
            initTable(); // Refresh the table
        });
    });

    document.querySelectorAll('.accept-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const bookingId = e.target.getAttribute('data-id');
            await updateBookingStatus(bookingId, 'Accepted');
            initTable(); // Refresh the table
        });
    });
}

async function initTable() {
    const data = await fetchBookings();
    if (data) {
        populateTable(data);
    } else {
        console.error('No data returned from fetchBookings');
    }
}

document.addEventListener('DOMContentLoaded', initTable);