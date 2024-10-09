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


////// delete user

async function deleteUser() {
    const username = document.getElementById("usernameDelete").value;

    try {
        const response = await fetch(`https://localhost:44321/api/Users/username/${username}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showToast(`User ${username} deleted successfully!`, 'success');
            document.getElementById("usernameDelete").value = ''; // Clear input field
        } else {
            const errorText = await response.text();
            showToast(errorText || `Failed to delete user ${username}.`, 'error');
        }
    } catch (error) {
        showToast("Error deleting user: " + error.message, 'error');
    }
}


/////////// update user role
// Function to get the user ID by username or email
// Function to get the user ID by username or email
// Function to get the user ID by username or email
// async function getUserIdByUsername(username) {
//     const response = await fetch(`https://localhost:44321/api/Users/GetUserByUsernameOrEmail/${username}`);
//     if (!response.ok) {
//         throw new Error('User not found.');
//     }
//     const user = await response.json();
//     console.log(user); // Log user object for debugging
//     return user.id; // Ensure 'id' exists in the user object
// }

// Event listener for the update user role button
// Event listener for the update user role button
// document.getElementById('searchUserButton').addEventListener('click', function () {
//     const username = document.getElementById('usernameSearch2').value;

//     // Fetch user details using the username or email
//     fetch(`https://localhost:44321/api/Users/GetUserByUsernameOrEmail/${username}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data) {
//                 document.getElementById('displayUsername').innerText = data.username;
//                 document.getElementById('displayEmail').innerText = data.email;
//                 document.getElementById('userDetails').style.display = 'block';
//             } else {
//                 alert('User not found');
//             }
//         })
//         .catch(error => console.error('Error:', error));
// });





























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
    document.getElementById('userRole1').textContent = userData.userRole || 'N/A';
    document.getElementById('userFullName').textContent = `${userData.firstName} ${userData.lastName}` || 'N/A';

    if (userData.profileImage) {
        document.getElementById('userImage').src = '../../' + userData.profileImage;
        document.getElementById('userImage1').src = '../../' + userData.profileImage;


    }
}

// Function to display error message in UI
function displayError(message) {
    document.getElementById('userName').textContent = 'Error';
    document.getElementById('userRole1').textContent = 'Error';
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















let currentUserId = null; // Hold the current user ID
let currentUserRole = null; // Hold the current user role

function showToast(message, type) {
    console.log(`${type}: ${message}`);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Ensure buttons are present
    const searchUserButton = document.getElementById('searchUserButton');
    const updateUserButton = document.getElementById('updateUserButton');

    if (!searchUserButton || !updateUserButton) {
        console.error("Buttons not found. Check your HTML.");
        return;
    }

    // Search user by username or email
    searchUserButton.addEventListener('click', async function () {
        const searchTerm = document.getElementById('usernameSearch2').value.trim();
        console.log('Search Term:', searchTerm);

        if (!searchTerm) {
            showToast('Please enter a username or email to search.', 'error');
            return;
        }

        try {
            const response = await fetch(`https://localhost:44321/api/Users/GetUserByUsernameOrEmail/${searchTerm}`);
            console.log('Response Status for User Search:', response.status);

            if (!response.ok) {
                throw new Error('User not found.');
            }

            const user = await response.json();
            console.log('Fetched User:', user);

            if (!user || !user.userId) {
                throw new Error('User data is incomplete.');
            }

            currentUserId = user.userId;
            currentUserRole = user.userRole || 'User'; // Default to 'User' if role is undefined
            console.log(`Fetched Current Role: "${currentUserRole}"`);

            document.getElementById('displayUsername').innerText = user.username;
            document.getElementById('displayEmail').innerText = user.email;
            document.getElementById('userRole').value = currentUserRole;
            document.getElementById('userDetails').style.display = 'block';

        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // Update user role
    updateUserButton.addEventListener('click', async function () {
        const selectedRole = document.getElementById('userRole').value;

        console.log(`Current Role: "${currentUserRole}", Selected Role: "${selectedRole}"`);

        if (!currentUserId) {
            showToast('User ID is missing. Please search for a user first.', 'error');
            return;
        }

        if (!selectedRole) {
            showToast('Please select a valid role.', 'error');
            return;
        }

        // Compare roles for case-insensitive match
        if (selectedRole.trim().toLowerCase() === currentUserRole.trim().toLowerCase()) {
            showToast('The selected role is the same as the current role. No changes made.', 'info');
            return;
        }

        const requestBody = JSON.stringify({ userRole: selectedRole });
        console.log('Request Body:', requestBody);

        try {
            const response = await fetch(`https://localhost:44321/api/Users/UpdateUserRole/${currentUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: requestBody
            });

            console.log('Update Response Status:', response.status);

            const responseData = await response.json();
            console.log('Response Data for Update:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update role.');
            }

            if (responseData.success) {
                showToast(responseData.message, 'success');
                currentUserRole = selectedRole; // Update the current role after successful change
            } else {
                throw new Error(responseData.message || 'Failed to update role.');
            }
        } catch (error) {
            console.error('Error during role update:', error);
            showToast(`Error: ${error.message}`, 'error');
        }
    });
});
