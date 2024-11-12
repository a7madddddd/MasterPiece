

document.addEventListener('DOMContentLoaded', function () {
    // Sign Up functionality
    document.querySelector('#sign-up-form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form input values
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const password1 = this.querySelector('input[name="password"]').value;

        const registerDto = {
            username: name, 
            email: email, 
            password: password1, 
            
        };

        try {
            const response = await fetch('https://localhost:44321/api/Users/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerDto), 
            });

            if (!response.ok) {
                
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You have successfully registered.',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById("signIn").click();
                }
            });



           
            this.reset();
        } catch (error) {
            console.error("Registration failed:", error.message);
            
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed!',
                text: `Error: ${error.message}`,
                confirmButtonText: 'OK'
            });
        }
    });
});









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
                    confirmButtonText: 'As Admin',
                    cancelButtonText: 'As User',
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








