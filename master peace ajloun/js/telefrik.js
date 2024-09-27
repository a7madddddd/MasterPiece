










const tabs = document.querySelectorAll('.paytabs li');
const paymentForms = document.querySelectorAll('.payment-form');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelector('.paytabs li.payactive').classList.remove('payactive');
    tab.classList.add('payactive');

    // Hide all payment forms
    paymentForms.forEach(form => form.classList.remove('active'));

    // Show the payment form corresponding to the current tab
    const tabIndex = Array.prototype.indexOf.call(tabs, tab);
    paymentForms[tabIndex].classList.add('active');
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
