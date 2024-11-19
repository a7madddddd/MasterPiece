
function getJWTFromLocalStorage() {
    return localStorage.getItem('jwt');
}

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




























async function fetchMessages() {
    try {
        const response = await fetch('https://localhost:44321/api/ContactMessages');
        const data = await response.json();

        const messagesContainer = document.getElementById('messageDropdown');
        if (!messagesContainer) {
            console.error("Messages container not found.");
            return;
        }

        const limitedMessages = data.$values.slice(0, 4);

        let messagesHTML = '';
        limitedMessages.forEach(message => {
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

        messagesContainer.innerHTML = messagesHTML;

    } catch (error) {
        console.error('Error fetching messages:', error);
        const messagesContainer = document.getElementById('messageDropdown');
        if (messagesContainer) {
            messagesContainer.innerHTML = `<p class="text-danger">Unable to fetch messages at this time.</p>`;
        }
    }
}

async function fetchDropdownMessages() {
    try {
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

window.onload = function () {
    fetchMessages();          
    fetchDropdownMessages();  
};

























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
















//////////// conatct table //////////
document.addEventListener('DOMContentLoaded', () => {
    // Load contact messages when the page loads
    loadContactMessages();

    // Setup reply form submission handler
    const replyForm = document.getElementById('replyMessageForm');
    if (replyForm) {
        replyForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const adminReply = document.getElementById('adminReply')?.value.trim();
            const messageId = localStorage.getItem('selectedContactId');

            if (!adminReply) {
                Swal.fire('Warning', 'Please enter a reply message.', 'warning');
                return;
            }

            try {
                const contactMessageDto = {
                    ContactId: messageId,
                    Email: document.getElementById('userEmail')?.value || '',
                    Subject: document.getElementById('messageSubject')?.value || '',
                    Message: document.getElementById('userMessage')?.value || '',
                    replay: adminReply,
                    Name: document.getElementById('username')?.value || ''
                };

                const response = await fetch(`https://localhost:44321/api/ContactMessages/replyToMessage/${messageId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contactMessageDto)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to send reply message.');
                }

                Swal.fire('Success', 'Reply sent successfully.', 'success');
                replyForm.reset();

                const modalInstance = bootstrap.Modal.getInstance(document.getElementById('replyModal'));
                modalInstance?.hide();

                await loadContactMessages();
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', error.message || 'Failed to send reply message.', 'error');
            }
        });
    }
});

async function loadContactMessages() {
    try {
        const response = await fetch('https://localhost:44321/api/ContactMessages');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to load contact messages.');
        }

        const data = await response.json();
        const contactTableBody = document.querySelector('.table tbody');
        if (!contactTableBody) {
            console.error('Table body not found');
            return;
        }

        contactTableBody.innerHTML = '';
        const lastMessages = (data.$values || data).slice(-15).reverse();

        lastMessages.forEach((message, index) => {
            const formattedDate = new Date(message.submittedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${message.name || 'N/A'}</td>
                <td>${message.subject || 'N/A'}</td>
                <td>${message.email || 'N/A'}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openReplyModal(${message.messageId})">Reply</button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDelete(${message.messageId})">Delete</button>
                </td>
            `;
            contactTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading contact messages:', error);
        Swal.fire('Error', error.message || 'Failed to load contact messages.', 'error');
    }
}

async function openReplyModal(messageId) {
    try {
        localStorage.setItem('selectedContactId', messageId);

        const response = await fetch(`https://localhost:44321/api/ContactMessages/${messageId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to fetch message details.');
        }

        const data = await response.json();
        document.getElementById('userEmail').value = data.email || '';
        document.getElementById('messageSubject').value = data.subject || '';
        document.getElementById('userMessage').value = data.message || '';
        document.getElementById('username').value = data.name || '';
        document.getElementById('adminReply').value = data.replay ||  '';

        const replyModal = new bootstrap.Modal(document.getElementById('replyModal'));
        replyModal.show();
    } catch (error) {
        console.error('Failed to load message details:', error);
        Swal.fire('Error', error.message || 'Failed to load message details.', 'error');
    }
}

function confirmDelete(messageId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`https://localhost:44321/api/ContactMessages/${messageId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to delete message.');
                }

                Swal.fire('Deleted!', 'The message has been deleted.', 'success');
                await loadContactMessages();
            } catch (error) {
                console.error('Delete error:', error);
                Swal.fire('Error', error.message || 'Failed to delete message.', 'error');
            }
        }
    });
}
