document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('jwt');

    if (!token) {
        console.error('No JWT token found');
        return;
    }

    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;

    const bookingApiUrl = `https://localhost:44321/api/Bookings/user/${userId}`;
    const paymentApiUrl = `https://localhost:44321/api/Payments/userPayment/${userId}`;
    const tableBody = document.getElementById("booking-table-body");

    // Fetch and display bookings
    fetch(bookingApiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);

            const bookings = data.$values;

            if (Array.isArray(bookings)) {
                if (bookings.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='7'>No bookings found.</td></tr>";
                    return;
                }

                bookings.forEach(booking => {
                    if (booking.status === "Completed") {
                        return;
                    }

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${booking.serviceName}</td>
                        <td><img src="${booking.image}" alt="${booking.serviceName}"></td>
                        <td>${new Date(booking.bookingDate).toLocaleDateString()}</td>
                        <td>${booking.numberOfPeople}</td>
                        <td>${booking.totalAmount}  jd</td>
                        <td>${booking.status}</td>
                        <td><button class="btn btn-primary btn-sm payment-btn" data-booking-id="${booking.bookingId}">Pay Now</button></td>
                    `;
                    tableBody.appendChild(row);
                });

                // Add event listeners for payment buttons
                document.querySelectorAll(".payment-btn").forEach(button => {
                    button.addEventListener("click", function () {
                        const bookingId = this.getAttribute("data-booking-id");
                        window.location.href = `book.html?bookingId=${bookingId}`;
                    });
                });
            }
        })
        .catch(error => {
            console.error("There was an error fetching the bookings:", error);
        });

    // Fetch and display payment status
    fetch(paymentApiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Payment API Response:', data);

            const tableBody = document.getElementById("payment-table-body2");
            const payments = data.$values;

            tableBody.innerHTML = '';

            payments.forEach(payment => {
                const row = document.createElement("tr");

                const serviceIdCell = document.createElement("td");
                serviceIdCell.textContent = payment.serviceName || 'N/A';

                const amountCell = document.createElement("td");
                amountCell.textContent = `${payment.amount.toFixed(2)} jd`;

                const dateCell = document.createElement("td");
                dateCell.textContent = new Date(payment.paymentDate).toLocaleDateString();

                const statusCell = document.createElement("td");
                statusCell.textContent = payment.paymentStatus === "COMPLETED" ? "Completed" : "Pending";
                statusCell.classList.add(payment.paymentStatus === "COMPLETED" ? "text-success" : "text-danger");

                row.appendChild(serviceIdCell);
                row.appendChild(amountCell);
                row.appendChild(dateCell);
                row.appendChild(statusCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("There was an error fetching the payment status:", error);
        });
});
///////////////////////


// User Profile Manager Module
const UserProfileManager = {
    init() {
        const token = localStorage.getItem('jwt');
        if (!this.validateToken(token)) return;

        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId || decodedToken.sub;

        this.setupEventListeners(userId, token);
        this.fetchUserData(userId, token);
    },

    validateToken(token) {
        if (!token) {
            this.handleAuthError("JWT token is missing in local storage");
            return false;
        }

        try {
            const decodedToken = jwt_decode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                this.handleAuthError("JWT token is expired");
                return false;
            }
        } catch (error) {
            console.error("Token decoding failed:", error);
            this.handleAuthError("Invalid JWT token");
            return false;
        }
        return true;
    },

    handleAuthError(message) {
        console.error(message);

        
        Swal.fire({
            title: 'Session Expired',
            text: 'Please log in again.',
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = 'login.html';
        });
    },


    async verifyPassword(userId, currentPassword, token) {
        try {
            const decodedToken = jwt_decode(token);
            const usernameOrEmail = decodedToken.username || decodedToken.email; // Adjust based on actual token structure

            const response = await fetch(`https://localhost:44321/api/Users/VerifyPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId,
                    password: currentPassword,
                    UsernameOrEmail: usernameOrEmail // Add the required UsernameOrEmail field
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Password verification failed:', errorMessage);
            }
            return response.ok;
        } catch (error) {
            console.error('Error verifying password:', error);
            return false;
        }
    },
    async handleCurrentPasswordInput() {
        const currentPassword = document.getElementById('currentPassword').value;
        const token = localStorage.getItem('jwt');
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId || decodedToken.sub;

        if (currentPassword) {
            const isPasswordCorrect = await this.verifyPassword(userId, currentPassword, token);
            if (isPasswordCorrect) {
                this.enableNewPasswordFields();
                document.getElementById('currentPasswordError').textContent = ''; // Clear error message if correct
            } else {
                this.disableNewPasswordFields();
                document.getElementById('currentPasswordError').textContent = 'Incorrect current password.';
            }
        } else {
            this.disableNewPasswordFields(); // Keep new password fields disabled if no current password entered
        }
    },

    enableNewPasswordFields() {
        document.getElementById('newPassword').disabled = false;
        document.getElementById('confirmPassword').disabled = false;
    },

    disableNewPasswordFields() {
        document.getElementById('newPassword').disabled = true;
        document.getElementById('confirmPassword').disabled = true;
    },

    fetchUserData(userId, token) {
        fetch(`https://localhost:44321/api/Users/GetUserProfile/${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch user data: ${response.status}`);
                return response.json();
            })
            .then(data => this.populateUserData(data))
            .catch(error => console.error('Error fetching user data:', error));
    },

    populateUserData(data) {
        const fields = ['username', 'firstName', 'lastName', 'email', 'phone'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) element.value = data[field] || '';
        });

        if (data.profileImage) {
            document.getElementById('userPhoto').src = data.profileImage;
        }

        document.getElementById('userName').textContent = `${data.firstName} ${data.lastName}`;
        if (data.location) {
            document.getElementById('userLocation').textContent = data.location;
        }
    },

    async validatePasswordChange(newPassword, currentPassword, userId, token) {
        if (!newPassword) return true;

        if (!currentPassword) {
            await Swal.fire({
                icon: 'warning',
                title: 'Missing Current Password',
                text: 'Please enter your current password to change it.',
            });
            return false;
        }

        const isPasswordValid = await this.verifyPassword(userId, currentPassword, token);
        if (!isPasswordValid) {
            await Swal.fire({
                icon: 'error',
                title: 'Incorrect Password',
                text: 'Current password is incorrect.',
            });
            return false;
        }

        if (newPassword.length < 6) {
            await Swal.fire({
                icon: 'info',
                title: 'Password Too Short',
                text: 'New password must be at least 6 characters long.',
            });
            return false;
        }

        return true;
    },

    buildFormData(userId, newPassword) {
        const formData = new FormData();
        formData.append('UserId', userId);

        const fields = ['username', 'firstName', 'lastName', 'email', 'phone'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element?.value) formData.append(field, element.value);
        });

        if (newPassword) {
            formData.append('password', newPassword);
        }

        const profilePicture = document.getElementById('profile-picture');
        if (profilePicture && profilePicture.files && profilePicture.files.length > 0) {
            formData.append('usersImagesFile', profilePicture.files[0]);
        }

        return formData;
    },

    async updateUserProfile(userId, token, formData) {
        try {
            const response = await fetch(`https://localhost:44321/api/Users/UpdateUserProfile/${userId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update user data: ${errorText}`);
            }

            const data = await response.json();

            // Display success message from response
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: data.message,
            });

            // Clear password fields
            ['password', 'currentPassword'].forEach(field => {
                const element = document.getElementById(field);
                if (element) element.value = '';
            });

            this.fetchUserData(userId, token);
            return true;
        } catch (error) {
            console.error('Error updating user profile:', error);

            // Display error message
            await Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update profile. Please try again.',
            });
            return false;
        }
    },

    setupEventListeners(userId, token) {
        const form = document.getElementById('userProfileForm');
        if (!form) {
            console.error("User profile form not found");
            return;
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const newPassword = document.getElementById('confirmPassword').value;
            const currentPassword = document.getElementById('currentPassword').value;

            const isPasswordValid = await this.validatePasswordChange(
                newPassword,
                currentPassword,
                userId,
                token
            );

            if (!isPasswordValid) return;

            const formData = this.buildFormData(userId, newPassword);
            await this.updateUserProfile(userId, token, formData);
        });
    }
};



// Initialize the module when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => UserProfileManager.init());


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
async function logout() {
    localStorage.removeItem('jwt'); // Remove JWT from local storage

    await Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'Logged out successfully!',
    });

    window.location.reload(); // Reload the page to refresh the navbar
}




////////////////// validation
function validateNewPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const errorElement = document.getElementById('newPasswordError');

    if (newPassword && newPassword.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters long';
        return false;
    }

    errorElement.textContent = '';
    return true;
}

function validatePasswordMatch() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('confirmPasswordError');

    if (confirmPassword && newPassword !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        return false;
    }

    errorElement.textContent = '';
    return true;
}

// Add this to your existing UserProfileManager or form submit handler
async function validatePasswordFields() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // If no password change is attempted, return true
    if (!newPassword && !confirmPassword) {
        return true;
    }

    // Check if current password is provided when attempting to change password
    if (!currentPassword) {
        document.getElementById('currentPasswordError').textContent = 'Please enter your current password';
        return false;
    }

    // Validate new password
    if (!validateNewPassword()) {
        return false;
    }

    // Validate password match
    if (!validatePasswordMatch()) {
        return false;
    }

    // Verify current password with server
    const isPasswordValid = await UserProfileManager.verifyPassword(userId, currentPassword, token);
    if (!isPasswordValid) {
        document.getElementById('currentPasswordError').textContent = 'Current password is incorrect';
        return false;
    }

    return true;
}