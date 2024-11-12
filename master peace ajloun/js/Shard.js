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
                <a href="edit_profile.html" id="profile_icon">Profile</a>
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

// Function to handle logout
function logout() {
    localStorage.removeItem('jwt'); // Remove JWT from local storage

    // Show a styled success message for logout using AlertifyJS
    alertify.success("Logged out successfully!");

    // Delay page reload to allow user to see the message
    setTimeout(() => {
        window.location.reload();
    }, 1000); // 1-second delay before reloading to display the message
}
