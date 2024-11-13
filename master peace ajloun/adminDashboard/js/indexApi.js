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
                            <h6 class="mb-0">${message.name}-${message.email}</h6>
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







    async function fetchPayments() {
    try {
        const response = await fetch('https://localhost:44321/api/Payments');
    if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    const data = await response.json();
    console.log('Fetched Payments:', data); // Log the fetched data
    return data.$values || []; // Ensure we access $values correctly
    } catch (error) {
        console.error('Error fetching payments:', error);
    return [];
    }
}

    function calculateSalesAndRevenue(payments) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    let todaySaleCount = 0;
    let totalSaleCount = 0;
    let todayRevenue = 0;
    let totalRevenue = 0;

    payments.forEach(payment => {
        const paymentDate = new Date(payment.paymentDate);
    const amount = payment.amount;

    // Update today's sale and revenue
    if (paymentDate.toISOString().split('T')[0] === today) {
        todaySaleCount++;
    todayRevenue += amount;
        }

    // Update total sale and revenue
    totalSaleCount++;
    totalRevenue += amount;
    });

    return {
        todaySale: todaySaleCount,
    totalSale: totalSaleCount,
    todayRevenue: todayRevenue,
    totalRevenue: totalRevenue,
    };
}

    async function updatePaymentStatistics() {
    const payments = await fetchPayments();
    const stats = calculateSalesAndRevenue(payments);

    // Log the stats to verify calculations
    console.log('Payment Statistics:', stats);

    // Update the DOM with the fetched statistics
    document.getElementById('todaySale').textContent = `${stats.todaySale} jd`;
    document.getElementById('totalSale').textContent = `${stats.totalSale} jd`;
    document.getElementById('todayRevenue').textContent = `${stats.todayRevenue.toFixed(2)} jd`;
    document.getElementById('totalRevenue').textContent = `${stats.totalRevenue.toFixed(2)} jd`;
}

// Call the function to update payment statistics when the document is ready
document.addEventListener('DOMContentLoaded', () => {
        updatePaymentStatistics();
});







async function fetchNotifications() {
    try {
        const response = await fetch('https://localhost:44321/api/JoinRequests');
        const data = await response.json();
        const lastThreeRequests = data.$values.slice(-3).reverse();

        const dropdownContent = document.getElementById('notificationDropdown');
        dropdownContent.innerHTML = ''; // Clear existing content

        lastThreeRequests.forEach(request => {
            const notificationItem = document.createElement('a');
            notificationItem.href = '#';
            notificationItem.className = 'dropdown-item';
            notificationItem.innerHTML = `
                        <h6 class="fw-normal mb-0">${request.name}</h6>
                        <small>${request.message}</small>
                    `;
            dropdownContent.appendChild(notificationItem);

            const divider = document.createElement('hr');
            divider.className = 'dropdown-divider';
            dropdownContent.appendChild(divider);
        });

        const seeAllLink = document.createElement('a');
        seeAllLink.href = '#';
        seeAllLink.className = 'dropdown-item text-center';
        seeAllLink.textContent = 'See all notifications';
        dropdownContent.appendChild(seeAllLink);
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
}

// Fetch notifications when the page loads
document.addEventListener('DOMContentLoaded', fetchNotifications);