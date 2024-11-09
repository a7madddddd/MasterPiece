
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
        const messagesContainer = document.getElementById('messageDropdown');
        if (!messagesContainer) {
            console.error("Messages container not found.");
            return;
        }

        // Limit the number of messages to the first 4
        const limitedMessages = data.$values.slice(0, 4);

        // Build the HTML for all messages first
        let messagesHTML = '';
        limitedMessages.forEach(message => {
            // Create the HTML structure for each message
            messagesHTML += `
                <div class="d-flex align-items-center border-bottom py-3">
                    
                    <div class="w-100 ms-3">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-0">${message.name}</h6>
                            <small>${new Date(message.submittedAt).toLocaleTimeString()}</small>
                        </div>
                        <span>${message.message}</span>
                    </div>
                </div>
            `;
        });

        // Update the container once with all the messages
        messagesContainer.innerHTML = messagesHTML;

    } catch (error) {
        console.error('Error fetching messages:', error);
        const messagesContainer = document.getElementById('messageDropdown');
        if (messagesContainer) {
            messagesContainer.innerHTML = `<p class="text-danger">Unable to fetch messages at this time.</p>`;
        }
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
        if (!messageDropdown) {
            console.error("Dropdown container not found.");
            return;
        }

        // Limit the messages to the first 4
        const limitedMessages = data.$values.slice(0, 4);

        // Build the HTML for all messages first
        let dropdownHTML = '';
        limitedMessages.forEach(message => {
            dropdownHTML += `
                <a href="#" class="dropdown-item">
                    <div class="d-flex align-items-center">
                        <div class="ms-2">
                            <h6 class="fw-normal mb-0">${message.name} sent you a message</h6>
                            <small>${new Date(message.submittedAt).toLocaleTimeString()}</small>
                        </div>
                    </div>
                </a>
                <hr class="dropdown-divider">
            `;
        });

        // Add "See all messages" link at the bottom
        dropdownHTML += `
            <a href="#" class="dropdown-item text-center">See all messages</a>
        `;

        // Update the dropdown once with all the messages
        messageDropdown.innerHTML = dropdownHTML;

    } catch (error) {
        console.error('Error fetching dropdown messages:', error);
        const messageDropdown = document.getElementById('messageDropdown');
        if (messageDropdown) {
            messageDropdown.innerHTML = `<p class="text-danger">Unable to fetch messages at this time.</p>`;
        }
    }
}

// Fetch the messages for both sections when the page loads
window.onload = function () {
    fetchMessages();          // Fetch messages for the main container
    fetchDropdownMessages();  // Fetch messages for the dropdown
};
//////////////////////////////////////////////////////////////////////////////






// Function to load the latest 15 join requests and populate the table
async function loadJoinRequests() {
    try {
        const response = await fetch('https://localhost:44321/api/JoinRequests');
        const data = await response.json();

        const tableBody = document.getElementById('joinRequestsTable');
        tableBody.innerHTML = '';  // Clear the existing table rows

        // Get the last 15 requests
        const last15Requests = data.$values.slice(-15);

        last15Requests.forEach((request, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${request.name}</td>
                <td>${request.phone}</td>
                <td>${request.email}</td>
                <td>${request.message}</td>
                <td>
                    <img src="https://localhost:44321/${request.serviceImage}" alt="Service Image" width="40" height="40" />
                </td>
                <td>
                    <button class="btn btn-primary" onclick="openReplyModal(${request.requestId})">Reply</button>
                    <button class="btn btn-danger" onclick="confirmDeleteJoinRequest(${request.requestId})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load join requests:', error);
    }
}

// Call the function on page load to populate the join requests
document.addEventListener('DOMContentLoaded', loadJoinRequests);

// Function to open the reply modal and populate the form
// Function to open the reply modal and populate the form
// Function to open the reply modal and populate the form
async function openReplyModal(requestId) {
    try {
        const response = await fetch(`https://localhost:44321/api/JoinRequests/${requestId}`);
        const request = await response.json();

        // Populate the reply modal with request data
        document.getElementById('userEmail').value = request.email;
        document.getElementById('message').value = request.message;

        // Construct the image URL
        const imageUrl = `https://localhost:44321/${request.serviceImage}`;

        // Get the image element
        const serviceImageElement = document.getElementById('serviceImage');

        // Set the image source to display the user's service image
        serviceImageElement.src = imageUrl;

       

        // Store the requestId in the modal for later use when sending the reply
        document.getElementById('replyMessageForm').setAttribute('data-request-id', requestId);

        // Show the modal
        const replyModal = new bootstrap.Modal(document.getElementById('replyModal'));
        replyModal.show();
    } catch (error) {
        console.error('Failed to fetch join request details:', error);
    }
}



// Handle the reply form submission
// Handle the reply form submission
document.getElementById('replyMessageForm').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the default form submission behavior

    const requestId = document.getElementById('replyMessageForm').getAttribute('data-request-id');
    const adminReply = document.getElementById('adminReply').value;

    if (!adminReply.trim()) {
        Swal.fire('Warning', 'Please enter a reply message.', 'warning');
        return;
    }

    try {
        const response = await fetch(`https://localhost:44321/api/JoinRequests/replyToJoinRequest/${requestId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminReply) // Send the string directly
        });

        if (!response.ok) throw new Error('Failed to send reply message');

        Swal.fire('Success', 'Reply sent successfully.', 'success');

        // Close the modal
        const replyModal = bootstrap.Modal.getInstance(document.getElementById('replyModal'));
        replyModal.hide();

        // Reload the join requests table
        loadJoinRequests();
    } catch (error) {
        console.error('Error sending reply message:', error);
        Swal.fire('Error', 'Failed to send reply message. Please try again.', 'error');
    }
});


// Function to delete a join request
async function deleteJoinRequest(requestId) {
    try {
        const response = await fetch(`https://localhost:44321/api/JoinRequests/${requestId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete join request');
        }

        Swal.fire('Success', 'Join request deleted successfully.', 'success');

        // Reload the join requests table after deletion
        loadJoinRequests();
    } catch (error) {
        console.error('Error deleting join request:', error);
        Swal.fire('Error', 'Failed to delete join request. Please try again.', 'error');
    }
}
