
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








//////////// conatct table //////////

// Function to fetch and display the last 15 messages in the table
// Function to fetch and display the last 15 messages in the table
async function loadContactMessages() {
    try {
        const response = await fetch('https://localhost:44321/api/ContactMessages');

        if (!response.ok) {
            throw new Error(`Failed to load contact messages: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Contact messages loaded:', data);

        const contactTableBody = document.querySelector('.table tbody');
        contactTableBody.innerHTML = '';  // Clear any existing rows

        // Get only the last 15 messages in reverse order (newest first)
        const lastMessages = data.$values.slice(-15).reverse();

        lastMessages.forEach((message, index) => {
            const formattedDate = new Date(message.submittedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${message.name}</td>
                <td>${message.subject}</td>
                <td>${message.email}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-primary" onclick="openReplyModal(${message.messageId})">Reply</button>
                    <button class="btn btn-danger" onclick="confirmDelete(${message.messageId})">Delete</button>
                </td>
            `;
            contactTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading contact messages:', error);
        Swal.fire('Error', 'Failed to load contact messages. Please try again later.', 'error');
    }
}

// Open the reply modal and load the message data for the selected message
async function openReplyModal(messageId) {
    try {
        const response = await fetch(`https://localhost:44321/api/ContactMessages/${messageId}`);
        const data = await response.json();

        // Populate the form fields with the message data
        document.getElementById('userName').value = data.name;
        document.getElementById('userEmail').value = data.email;
        document.getElementById('messageSubject').value = data.subject;
        document.getElementById('userMessage').value = data.message;

        // Show the modal
        const replyModal = new bootstrap.Modal(document.getElementById('replyModal'));
        replyModal.show();
    } catch (error) {
        console.error('Failed to load message data:', error);
        Swal.fire('Error', 'Failed to load message details.', 'error');
    }
}

// Confirm and delete a message by ID with SweetAlert
function confirmDelete(messageId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteMessage(messageId);
        }
    });
}

// Function to delete a message by ID
async function deleteMessage(messageId) {
    try {
        const response = await fetch(`https://localhost:44321/api/ContactMessages/${messageId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete message: ${response.statusText}`);
        }

        Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Message deleted successfully.'
        });

        loadContactMessages();  // Refresh the table after deletion
    } catch (error) {
        console.error('Error deleting message:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the message. Please try again later.'
        });
    }
}

// Handle form submission for sending the reply
document.getElementById('replyMessageForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const adminReply = document.getElementById('adminReply').value;

    if (!adminReply.trim()) {
        Swal.fire('Warning', 'Please enter a reply message.', 'warning');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('ContactId', localStorage.getItem('selectedContactId'));
        formData.append('Name', document.getElementById('userName').value);
        formData.append('Email', document.getElementById('userEmail').value);
        formData.append('Subject', document.getElementById('messageSubject').value);
        formData.append('Message', document.getElementById('userMessage').value);
        formData.append('MessageReply', adminReply);

        // Send reply message to backend API
        const response = await fetch('http://localhost:25025/api/Contact/PostMessageToEmail', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to send reply message');

        Swal.fire('Success', 'Reply sent successfully.', 'success');
        document.getElementById('adminReply').value = '';  // Clear reply field after sending

        // Close the modal
        const replyModal = bootstrap.Modal.getInstance(document.getElementById('replyModal'));
        replyModal.hide();

    } catch (error) {
        console.error('Error sending reply message:', error);
        Swal.fire('Error', 'Failed to send reply message. Please try again.', 'error');
    }
});

// Call the function on page load
document.addEventListener('DOMContentLoaded', loadContactMessages);







/////////// function to replay messages //////////////////////////////////
// Function to load message data and populate form
// Function to load message data and populate form
async function loadMessageData() {
    const contactId = localStorage.getItem('selectedContactId'); // Retrieve message ID from localStorage
    if (!contactId) {
        Swal.fire('Error', 'No message selected.', 'error');
        return;
    }

    try {
        const response = await fetch(`https://localhost:44321/api/ContactMessages/${contactId}`);
        const data = await response.json();

        // Populate the form with data
        document.getElementById('userName').value = data.name;
        document.getElementById('userEmail').value = data.email;
        document.getElementById('messageSubject').value = data.subject;
        document.getElementById('userMessage').value = data.message;

    } catch (error) {
        console.error('Failed to load message data:', error);
        Swal.fire('Error', 'Failed to load message details.', 'error');
    }
}

// Handle form submission for sending the reply
document.getElementById('replyMessageForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const adminReply = document.getElementById('adminReply').value;

    if (!adminReply.trim()) {
        Swal.fire('Warning', 'Please enter a reply message.', 'warning');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('ContactId', localStorage.getItem('selectedContactId'));
        formData.append('Name', document.getElementById('userName').value);
        formData.append('Email', document.getElementById('userEmail').value);
        formData.append('Subject', document.getElementById('messageSubject').value);
        formData.append('Message', document.getElementById('userMessage').value);
        formData.append('MessageReply', adminReply);

        // Send reply message to backend API
        const response = await fetch('http://localhost:25025/api/Contact/PostMessageToEmail', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to send reply message');

        Swal.fire('Success', 'Reply sent successfully.', 'success');
        document.getElementById('adminReply').value = '';  // Clear reply field after sending

    } catch (error) {
        console.error('Error sending reply message:', error);
        Swal.fire('Error', 'Failed to send reply message. Please try again.', 'error');
    }
});

// Load message data on page load
document.addEventListener('DOMContentLoaded', loadMessageData);