

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

            const data = await response.json(); // Assuming the API responds with JSON

            // Show success alert and handle successful login
            await Swal.fire({
                icon: 'success',
                title: 'Login successful!',
                text: `Welcome back! ${email}`,
            });

            localStorage.setItem('jwt', data.token); // Use data instead of result
            console.log("Login successful:", data);

            // Reset the form
            this.reset();

            // Redirect or perform additional actions here
            // window.location.href = '/dashboard'; // Example redirection

        } catch (error) {
            console.error("Login failed:");
            // Show error alert
            await Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: error.message, // Show error message
            });
        }
    });
});
