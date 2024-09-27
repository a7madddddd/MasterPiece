document.getElementById('joinRequestForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = new FormData(this);

    try {
        const response = await fetch('https://localhost:44321/api/JoinRequests', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${errorText}`);
        }

        const result = await response.json();
        console.log('Join request submitted successfully:', result);
        customAlert('Your request has been submitted successfully!', 'success');

    } catch (error) {
        console.error('Error submitting join request:', error);
        customAlert('There was an error submitting your request. Please try again.', 'error');
    }

});

/////////////////////// alert



function customAlert(message, type = 'info') {
    const options = {
        title: type === 'success' ? 'Success!' : 'Error!',
        text: message,
        icon: type === 'success' ? 'success' : 'error',
        confirmButtonText: 'Okay',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
            // Additional action after closing, if needed
        }
    };

    Swal.fire(options);
}





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
            <a href="edit_profile.html" id ="profile_icon">Profile</a>         <small style="color: whitesmoke;">|</small>



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
