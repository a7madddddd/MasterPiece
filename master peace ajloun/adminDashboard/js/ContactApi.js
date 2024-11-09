
// Function to update UI with user data
// Function to get JWT from local storage
function getJWTFromLocalStorage() {
    return localStorage.getItem('jwt');
}

// Function to decode JWT token
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

// Function to fetch user data
async function fetchUserData(userId) {
    try {
        const response = await fetch(`https://localhost:44321/api/Users/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

// Function to update UI with user data
function updateUI(userData) {
    if (!userData) {
        console.error('No user data available to update UI');
        return;
    }
    document.getElementById('userName').textContent = userData.username || 'N/A';
    document.getElementById('userRole').textContent = userData.userRole || 'N/A';
    document.getElementById('userFullName').textContent = `${userData.firstName} ${userData.lastName}` || 'N/A';

    if (userData.profileImage) {
        document.getElementById('userImage').src = '../../' + userData.profileImage;
        document.getElementById('userImage1').src = '../../' + userData.profileImage;


    }
}

// Function to display error message in UI
function displayError(message) {
    document.getElementById('userName').textContent = 'Error';
    document.getElementById('userRole').textContent = 'Error';
    document.getElementById('userFullName').textContent = 'Error';
    console.error(message);
}

// Main function to initialize the page
async function initializePage() {
    try {
        const jwtToken = getJWTFromLocalStorage();

        if (!jwtToken) {
            displayError('No JWT found in local storage. Please log in.');
            return;
        }

        const decodedToken = decodeJWT(jwtToken);
        if (decodedToken && decodedToken.userId) {
            const userData = await fetchUserData(decodedToken.userId);
            if (userData) {
                updateUI(userData);
            } else {
                displayError('Failed to fetch user data');
            }
        } else {
            displayError('Invalid or missing user ID in JWT');
        }
    } catch (error) {
        displayError(`Failed to initialize: ${error.message}`);
    }
}

// Call the initialization function when the page loads
window.addEventListener('load', initializePage);




















document.addEventListener("DOMContentLoaded", function () {
          const userBox = document.getElementById('userBox');

    if (userBox) {
            const token = localStorage.getItem('jwt');

    if (token) {
        userBox.innerHTML = `
                            <a href="edit_profile.html" id ="profile_icon">Profile</a>         
                            <small style="color: whitesmoke;">|</small>
                            <div class="user_box_link">
                                <a href="#" id="logoutButton">Logout</a>
                            </div>
                        `;

    document.getElementById('logoutButton').addEventListener('click', function (event) {
        event.preventDefault(); 
    logout();
              });
            } else {
        
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

    function logout() {
        localStorage.removeItem('jwt'); 

    alertify.success("Logged out successfully!");

          setTimeout(() => {
        window.location.reload();
          }, 1000);
        }










// Function to fetch and display messages in the main section
async function fetchMessages() {
    try {
        // Fetch messages from the API
        const response = await fetch('https://localhost:44321/api/ContactMessages');
        const data = await response.json();

        // Get the messages container div
        const messagesContainer = document.getElementById('messages-container');

        // Limit the number of messages to the first 4
        const limitedMessages = data.$values.slice(0, 4);

        // Loop through the first 4 messages and create HTML content dynamically
        limitedMessages.forEach(message => {
            // Create the HTML structure for each message
            const messageHTML = `
                <div class="d-flex align-items-center border-bottom py-3">
                    <img class="rounded-circle flex-shrink-0" src="img/user.jpg" alt="" style="width: 40px; height: 40px;">
                    <div class="w-100 ms-3">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-0">${message.name}</h6>
                            <small>${new Date(message.submittedAt).toLocaleTimeString()}</small>
                        </div>
                        <span>${message.message}</span>
                    </div>
                </div>
                `;

            // Append the message to the container
            messagesContainer.innerHTML += messageHTML;
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Function to fetch and display messages in the dropdown menu
async function fetchDropdownMessages() {
    try {
        // Fetch messages from the API
        const response = await fetch('https://localhost:44321/api/ContactMessages');
        const data = await response.json();

        // Get the dropdown menu container
        const messageDropdown = document.getElementById('messageDropdown');

        // Limit the messages to the first 4
        const limitedMessages = data.$values.slice(0, 4);

        // Loop through the limited messages and create dropdown items
        limitedMessages.forEach(message => {
            const messageHTML = `
                <a href="#" class="dropdown-item">
                    <div class="d-flex align-items-center">
                        <img class="rounded-circle" src="img/user.jpg" alt="" style="width: 40px; height: 40px;">
                        <div class="ms-2">
                            <h6 class="fw-normal mb-0">${message.name} sent you a message</h6>
                            <small>${new Date(message.submittedAt).toLocaleTimeString()}</small>
                        </div>
                    </div>
                </a>
                <hr class="dropdown-divider">
                `;

            // Append each message to the dropdown
            messageDropdown.innerHTML += messageHTML;
        });

        // Add "See all messages" link at the bottom
        const seeAllLink = `
                <a href="#" class="dropdown-item text-center">See all messages</a>
            `;
        messageDropdown.innerHTML += seeAllLink;

    } catch (error) {
        console.error('Error fetching dropdown messages:', error);
    }
}

// Fetch the messages for both sections when the page loads
window.onload = function () {
    fetchMessages();          // Fetch messages for the main container
    fetchDropdownMessages();  // Fetch messages for the dropdown
};

