
///// function to fetch booking table
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('jwt'); // Assuming JWT is stored in localStorage


    // Decode JWT to get userId
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId; // Change 'userId' to the actual key in your JWT payload

    const apiUrl = `https://localhost:44321/api/Bookings/user/${userId}`;
    const tableBody = document.getElementById("booking-table-body");

    // Function to fetch and display bookings
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Check the structure of the data

            const bookings = data.$values; // Access the bookings array from the response

            if (Array.isArray(bookings)) {
                if (bookings.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='7'>No bookings found.</td></tr>";
                    return;
                }

                bookings.forEach(booking => {
                    // Create a new row for each booking
                    const row = document.createElement("tr");

                    // Fill the row with booking data
                    row.innerHTML = `
                        
                        <td>${booking.serviceName}</td>
                        <td><img src="${booking.image}" alt="${booking.serviceName}" style="width: 50px; height: auto;"></td>
                        <td>${new Date(booking.bookingDate).toLocaleDateString()}</td>
                        <td>${booking.numberOfPeople}</td>
                        <td>${booking.totalAmount}</td>
                        <td>${booking.status}</td>
                        <td><button class="btn btn-primary btn-sm payment-btn" data-booking-id="${booking.bookingId}">Pay Now</button></td>
                    `;

                    // Append the row to the table
                    tableBody.appendChild(row);
                });


                // Add event listeners for payment buttons
                document.querySelectorAll(".payment-btn").forEach(button => {
                    button.addEventListener("click", function () {
                        const bookingId = this.getAttribute("data-booking-id");
                        alert(`Processing payment for booking ID: ${bookingId}`);
                        // Add payment logic here
                    });
                });
            }
        })
        .catch(error => {
            console.error("There was an error fetching the bookings:", error);
        });
});

///////////////////////





// JavaScript code
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userProfileForm');
    const token = localStorage.getItem('jwt');

    // Validate JWT and check token expiration
    if (token) {
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId || decodedToken.sub; // Adjust based on your JWT

        // Token expiration check
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (isTokenExpired) {
            console.error("JWT token is expired");
            alert("Session expired, please log in again.");
            return;
        }

        console.log('User ID:', userId);

        // Function to fetch and display user data
        function fetchUserData() {
            fetch(`https://localhost:44321/api/Users/GetUserProfile/${userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    return response.json();
                })
                .then(data => {
                    // Populate form fields with user data
                    document.getElementById('username').value = data.username || '';
                    document.getElementById('firstName').value = data.firstName || '';
                    document.getElementById('lastName').value = data.lastName || '';
                    document.getElementById('email').value = data.email || '';
                    document.getElementById('phone').value = data.phone || '';

                    // Set profile image if available
                    if (data.profileImage) {
                        document.getElementById('userPhoto').src = data.profileImage;
                    }

                    // Set user name and location (if available)
                    document.getElementById('userName').textContent = `${data.firstName} ${data.lastName}`;
                    if (data.location) {
                        document.getElementById('userLocation').textContent = data.location;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                });
        }

        // Call the function to fetch and display user data when the page loads
        fetchUserData();

        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                const formData = new FormData();
                formData.append('UserId', userId);

                // Append form fields (username, firstName, etc.)
                const fields = ['username', 'firstName', 'lastName', 'email', 'phone', 'password'];
                fields.forEach(field => {
                    const element = document.getElementById(field);
                    if (element && element.value) {
                        formData.append(field, element.value);
                    }
                });

                // Append profile picture (file upload)
                const profilePicture = document.getElementById('profile-picture');
                if (profilePicture.files.length > 0) {
                    formData.append('usersImagesFile', profilePicture.files[0]);
                }
                

                fetch(`https://localhost:44321/api/Users/UpdateUserProfile/${userId}`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(err => {
                                throw new Error(`Failed to update user data: ${err}`);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert(data.message);
                        document.getElementById('password').value = ''; // Clear password field on success
                        fetchUserData(); // Refresh the user data after successful update
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Failed to update profile. Please try again.');
                    });
            });
        } else {
            console.error("User profile form not found");
        }
    } else {
        console.error("JWT token is missing in local storage");
        alert("You are not authenticated. Please log in.");
        window.location.href = 'login.html'; // Adjust the URL as needed

    }
});





/////////// update 




// Usage:
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userProfileForm');
    const token = localStorage.getItem('jwt');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            updateUserData(userId, token);
        });
    } else {
        console.error("User profile form not found");
    }
});





// Check if JWT is in local storage
document.addEventListener("DOMContentLoaded", function () {
    // Check if the element with ID 'userBox' exists
    const userBox = document.getElementById('userBox');

    if (userBox) {
        // Check if JWT is in local storage
        const token = localStorage.getItem('jwt');

        if (token) {
            // If user is logged in (JWT token found), show profile link
            userBox.innerHTML = `
            <a href="edit_profile.html" id ="profile_icon">Profile</a>   
                  <small style="color: whitesmoke;">|</small>



            <div class="user_box_link">
            <a href="#" id="logoutButton">Logout</a>
            </div>
            `;

            // Attach logout functionality to the "Logout" button
            document.getElementById('logoutButton').addEventListener('click', function (event) {
                event.preventDefault(); // Prevent default link behavior
                logout();
            });
        } else {
            // If user is not logged in, show login/register links
            userBox.innerHTML = `
                <div class="user_box_login user_box_link">
                    <a href="login.html">Login</a>
                </div>
                <div class="user_box_register user_box_link">
                    <a href="login.html">Register</a>
                </div>
            `;
        }
    } else {
        console.error("Element with ID 'userBox' not found.");
    }
});

// Function to handle logout, moved outside of the event listener
function logout() {
    localStorage.removeItem('jwt'); // Remove JWT from local storage
    alert("Logged out successfully!");
    window.location.reload(); // Reload the page to refresh the navbar
}
