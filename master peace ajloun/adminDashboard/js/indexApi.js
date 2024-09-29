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
