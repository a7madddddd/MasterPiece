
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






////////////// function to get  and user data ,, working good 
// document.addEventListener("DOMContentLoaded", function () {
//     const token = localStorage.getItem('jwt');
//     if (!token) {
//         alert("User is not authenticated");
//         return;
//     }

//     const decodedToken = jwt_decode(token);
//     const userId = decodedToken.userId;

//     // Fetch user data
//     fetch(`https://localhost:44321/api/Users/UserProfile${userId}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(user => {
//             // Set placeholder values with user data
//             document.getElementById("firstName").placeholder = user.firstName || 'First Name';
//             document.getElementById("lastName").placeholder = user.lastName || 'Last Name';
//             document.getElementById("email").placeholder = user.email || 'Email';
//             document.getElementById("phone").placeholder = user.phone || 'Enter Phone Number'; // Assuming you have a phone field in your DTO
//             document.getElementById('password').placeholder = '*******';
//             document.getElementById("userPhoto").src = user.profileImage || 'default-image-url.jpg'; // Use default image if not available
//             document.getElementById('userName').textContent = user.firstName;
//             document.getElementById('userLocation').textContent = user.email;




//             // You can set more placeholders if needed
//         })
//         .catch(error => {
//             console.error("There was an error fetching the user data:", error);
//         });
// });


document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('jwt');
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;

    // Fetch user data
    fetch(`https://localhost:44321/api/Users/GetUserProfile${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(user => {
            // Set values with user data
            const fields = ['username', 'firstName', 'lastName', 'email', 'phone'];
            fields.forEach(field => {
                const element = document.getElementById(field);
                if (element) element.value = user[field] || '';
            });

            const passwordElement = document.getElementById('password');
            if (passwordElement) passwordElement.placeholder = '*******';

            const userNameElement = document.getElementById('userName');
            if (userNameElement) userNameElement.textContent = user.username;

            const userLocationElement = document.getElementById('userLocation');
            if (userLocationElement) userLocationElement.textContent = user.email;
        })
        .catch(error => {
            console.error("There was an error fetching the user data:", error);
        });

    // Function to update user data
    const form = document.getElementById('userProfileForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData();
            formData.append('UserId', userId);

            // Only append non-empty values
            const fields = ['Username', 'Email', 'FirstName', 'LastName', 'Phone', 'Password'];
            fields.forEach(field => {
                const element = document.getElementById(field.toLowerCase());
                if (element && element.value) {
                    formData.append(field, element.value);
                }
            });

            // Handle file upload
            const profilePicture = document.getElementById('profile-picture');
            if (profilePicture && profilePicture.files[0]) {
                formData.append('profileImage', profilePicture.files[0]);
            }

            fetch(`https://localhost:44321/api/Users/UpdateUserProfile/${userId}`, {
                method: 'PUT',
                body: formData
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
                })
                .catch(error => console.error('Error:', error));
        });
    } else {
        console.error("User profile form not found");
    }
});