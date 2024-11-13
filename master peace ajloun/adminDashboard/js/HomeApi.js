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
            
            <td>${booking.serviceName || 'N/A'}</td>
            <td>${booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</td>
            <td>${booking.username || 'N/A'}</td>
            <td>${booking.numberOfPeople || 'N/A'}</td>
            <td>${(booking.totalAmount || 0).toFixed(2)} jd</td>
            <td>${booking.status || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-warning reject-btn" data-id="${booking.bookingId}">Reject</button>
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

















// Function to dynamically load the jwt-decode library
function loadJwtDecodeLibrary() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jwt-decode/3.1.2/jwt-decode.min.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load jwt-decode library'));
        document.head.appendChild(script);
    });
}

// Function to get JWT from local storage
function getJWTFromLocalStorage() {
    return localStorage.getItem('jwt');
}

// Function to decode JWT token
function decodeJWT(token) {
    try {
        return jwt_decode(token);
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