document.getElementById('loginButton').addEventListener('click', async function (event) {
    event.preventDefault();

    // Get the values from the input fields
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    // Prepare the request payload
    const payload = {
        userId: 0, // Assuming this is not needed for login
        email: email,
        password: password,
        userRole: "" // Not needed for login, but can be added if necessary
    };

    try {
        const response = await fetch('https://localhost:44321/api/Users/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            body: JSON.stringify(payload)
        });

        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }

        const data = await response.json();

        // Assuming the response includes a `userRole` property
        const userRole = data.userRole; // Adjust based on actual API response structure

        // Check user role
        if (userRole === 'Admin') {
            // Show success alert and redirect
            Swal.fire({
                title: 'Login Successful!',
                text: 'Welcome, Admin!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Redirect to admin dashboard or home page
                window.location.href = 'index.html'; // Change to your desired redirect page
            });
        } else {
            // Show error alert
            Swal.fire({
                title: 'Access Denied',
                text: 'You do not have permission to access this page.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

    } catch (error) {
        // Handle any errors (network issues, etc.)
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});
