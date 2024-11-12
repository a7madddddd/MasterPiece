

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



















function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.backgroundColor = type === 'success' ? 'green' : 'red';
    toast.style.display = 'block';

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Example usage
// Call this function when needed






