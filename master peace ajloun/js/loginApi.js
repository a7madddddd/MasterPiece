

document.addEventListener('DOMContentLoaded', function () {
    // Sign Up functionality
    document.querySelector('#sign-up-form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form input values
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const password1 = this.querySelector('input[name="password"]').value;

        // Create a plain JavaScript object with the necessary properties
        const registerDto = {
            username: name, // Use the name from the form
            email: email, // Use the email from the form
            password: password1, // Use the password from the form
            // Include other properties required by the API if needed
        };

        try {
            const response = await fetch('https://localhost:44321/api/Users/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerDto), // Send the registerDto object as JSON
            });

            if (!response.ok) {
                // Handle error responses
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            // Show success alert using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You have successfully registered.',
                confirmButtonText: 'OK'
            });

            // Optionally clear the form
            this.reset();
        } catch (error) {
            console.error("Registration failed:", error.message);
            // Show error alert using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed!',
                text: `Error: ${error.message}`,
                confirmButtonText: 'OK'
            });
        }
    });
});






    // // Sign In functionality
        // document.getElementById('loginForm').addEventListener('submit', async function (event) {
        //     event.preventDefault(); // Prevent default form submission
        //     const email = document.getElementById('loginUsername').value; // Should correspond to Email in DTO
        //     const password = document.getElementById('loginPassword').value; // Corresponds to Password in DTO

        //     const response = await fetch('https://localhost:44321/api/Users/Login', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ email: email, password: password })
        //     });


        //     if (response.ok) {
        //         const result = await response.json();
        //         alert(`Welcome back, ${result.email}`);
        //         localStorage.setItem('jwt', result.token);
        //     } else {
        //         const error = await response.json();
        //         alert(error.message); // Display the error message from the API
        //     }

        // });




document.addEventListener('DOMContentLoaded', function () {
    // Login functionality
    document.querySelector('#loginForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form input values
        const email = document.getElementById('loginUsername').value; // Corresponds to Email in DTO
        const password = document.getElementById('loginPassword').value; // Corresponds to Password in DTO

        // Create a plain JavaScript object with the necessary properties
        const loginDto = {
            Email: email,       // Ensure the key matches your DTO property
            Password: password   // Ensure the key matches your DTO property
        };

        try {
            const response = await fetch('https://localhost:44321/api/Users/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDto), // Send the loginDto object as JSON
            });

            if (!response.ok) {
                // Handle error responses
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json(); // Get the token and userRole from the response

            // Show success alert for regular users or admins
            await Swal.fire({
                icon: 'success',
                title: 'Login successful!',
                text: `Welcome back! ${email}`,
            });

            // Store JWT token and user role in local storage
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('userRole', data.userRole); // Store userRole as well

            console.log("Login successful:", data);

            // Reset the form
            this.reset();

            // Check if the user is an admin
            if (data.userRole === 'Admin') {
                // If admin, show options to continue as Admin or User
                const result = await Swal.fire({
                    title: 'Continue as Admin or User?',
                    text: 'Please select whether to continue as Admin or User',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Admin',
                    cancelButtonText: 'User',
                });

                // Redirect based on the choice
                if (result.isConfirmed) {
                    // Admin button clicked
                    window.location.href = '../adminDashboard/signin.html';
                } else {
                    // User button clicked or cancel button (continue as User)
                    window.location.href = 'services.html';
                }
            } else if (data.userRole === 'User') {
                // Redirect to user dashboard if it's a regular user
                window.location.href = 'services.html';
            } else {
                // Handle other roles if needed or show an error
                console.warn('Unknown role:', data.userRole);
                await Swal.fire({
                    icon: 'warning',
                    title: 'Unknown role',
                    text: `The role ${data.userRole} is not recognized.`,
                });
            }

        } catch (error) {
            console.error("Login failed:", error);
            // Show error alert
            await Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: error.message, // Show error message
            });
        }
    });
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
            <a href="edit_profile.html" id ="profile_icon">Profile</a>  <small style="color: whitesmoke;">|</small>



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
