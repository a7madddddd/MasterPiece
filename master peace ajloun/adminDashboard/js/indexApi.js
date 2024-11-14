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
                            <small>${new Date(message.submittedAt || Date.now()).toLocaleDateString()} ${new Date(message.submittedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>

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
        console.log('Raw API Response:', data);
        const payments = data.$values || [];
        console.log('Extracted Payments Array:', payments);
        return payments;
    } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
    }
}

function calculateSalesAndRevenue(payments) {
    const today = new Date().toISOString().split('T')[0];
    console.log('Today\'s Date for Comparison:', today);

    let todaySalesAmount = 0;    // Changed to track today's total amount
    let totalSalesAmount = 0;    // Changed to track all-time total amount
    let todayRevenue = 0;
    let totalRevenue = 0;

    payments.forEach(payment => {
        if (payment.paymentStatus === "COMPLETED") {
            const paymentDate = new Date(payment.paymentDate).toISOString().split('T')[0];
            const amount = parseFloat(payment.amount);

            // Calculate today's total amount
            if (paymentDate === today) {
                todaySalesAmount += amount;
                todayRevenue += amount;
            }

            // Calculate total amount for all days
            totalSalesAmount += amount;
            totalRevenue += amount;
        }
    });

    const stats = {
        todaySale: todaySalesAmount,      // Now represents today's total amount
        totalSale: totalSalesAmount,      // Now represents all-time total amount
        todayRevenue: todayRevenue,
        totalRevenue: totalRevenue
    };

    console.log('Final Calculated Stats:', stats);
    return stats;
}

async function updatePaymentStatistics() {
    const payments = await fetchPayments();
    const stats = calculateSalesAndRevenue(payments);

    // Format currency values
    const formatCurrency = (value) => {
        return value.toFixed(2);
    };

    // Update DOM with formatted values - now all values show amounts in JD
    document.getElementById('todaySale').textContent = `${formatCurrency(stats.todaySale)} jd`;
    document.getElementById('totalSale').textContent = `${formatCurrency(stats.totalSale)} jd`;
    document.getElementById('todayRevenue').textContent = `${formatCurrency(stats.todayRevenue)} jd`;
    document.getElementById('totalRevenue').textContent = `${formatCurrency(stats.totalRevenue)} jd`;

    console.log('DOM Updated with values:', {
        todaySale: document.getElementById('todaySale').textContent,
        totalSale: document.getElementById('totalSale').textContent,
        todayRevenue: document.getElementById('todayRevenue').textContent,
        totalRevenue: document.getElementById('totalRevenue').textContent
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing Payment Statistics');
    updatePaymentStatistics();
});

// Refresh every 5 minutes
setInterval(updatePaymentStatistics, 5 * 60 * 1000);




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












// Function to fetch and display the last 4 join requests
async function loadLastFourJoinRequests() {
    try {
        const response = await fetch("https://localhost:44321/api/JoinRequests");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const requests = data.$values;

        // Get the last 4 join requests
        const lastFourRequests = requests.slice(-4);

        const joinContainer = document.getElementById("joinContainer");

        lastFourRequests.forEach(request => {
            const JoinsHTmL = `
                    <div class="d-flex align-items-center border-bottom py-3">
                        <img class="rounded-circle flex-shrink-0" src="https://localhost:44321/${request.serviceImage || 'img/user.jpg'}" alt="" style="width: 40px; height: 40px;">
                        <div class="w-100 ms-3">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-0">${request.name} - ${request.email}</h6>
                                <small>${new Date(request.submittedAt || Date.now()).toLocaleDateString()} ${new Date(request.submittedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                            </div>
                            <span>${request.message}</span>
                        </div>
                    </div>
                `;

            // Append the formatted HTML to joinContainer
            joinContainer.insertAdjacentHTML('beforeend', JoinsHTmL);
        });
    } catch (error) {
        console.error("Error fetching join requests:", error);
    }
}

// Load join requests on page load
document.addEventListener("DOMContentLoaded", loadLastFourJoinRequests);