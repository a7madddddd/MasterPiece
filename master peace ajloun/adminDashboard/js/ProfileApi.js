// Function to decode JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
}

// Function to show toast notification
function showToast() {
    const toastElement = document.getElementById('update-toast');
    if (!toastElement) {
        console.error('Toast element not found!');
        return;
    }

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Fetch user data and populate the form with placeholders
async function populateUserData() {
    // Get JWT from local storage
    const token = localStorage.getItem('jwt');
    if (!token) {
        console.error('User is not logged in!');
        return;
    }

    // Decode the JWT to extract the UserId
    const decodedToken = parseJwt(token);
    const userId = decodedToken.userId || decodedToken.sub; // Ensure this matches your token structure

    try {
        // Fetch user data using dynamic userId
        const response = await fetch(`https://localhost:44321/api/Users/${userId}`);
        if (response.ok) {
            const userData = await response.json();

            // Populate the form fields with user data
            document.getElementById('username').placeholder = userData.username;
            document.getElementById('first-name').placeholder = userData.firstName;
            document.getElementById('last-name').placeholder = userData.lastName;
            document.getElementById('mobile-number').placeholder = userData.phone;
            document.getElementById('email').placeholder = userData.email;

            // Update profile image if it exists
            if (userData.profileImage) {
                document.getElementById('profile-img').src = `../${userData.profileImage}`;
            }
        } 
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Event listener for the save profile button
document.getElementById('save-profile').addEventListener('click', async function () {
    // Get JWT from local storage
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('User is not logged in!');
        return;
    }

    // Decode the JWT to extract the UserId
    const decodedToken = parseJwt(token);
    const userId = decodedToken.userId || decodedToken.sub;

    // Collect form data
    const username = document.getElementById('username').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const mobileNumber = document.getElementById('mobile-number').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profileImage = document.getElementById('profile-image-input').files[0];

    // Validate required fields
    if (!username || !firstName || !lastName || !mobileNumber || !email) {
        alert('Please fill in all required fields.');
        return;
    }

    // Prepare the FormData object for the multipart/form-data request
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Phone', mobileNumber);
    formData.append('Email', email);
    formData.append('UserId', userId);

    // Optionally add password and profile image if available
    if (password) {
        formData.append('Password', password);
    }
    if (profileImage) {
        formData.append('usersImagesFile', profileImage);
    }

    // API call (PUT request)
    try {
        const response = await fetch(`https://localhost:44321/api/Users/UpdateUserProfile/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,  // Attach JWT token
            },
            body: formData,  // Send formData (which contains text fields and image)
        });

        if (response.ok) {
            const result = await response.json();

            // Show success toast
            showToast();

            // Update placeholders with new data
            populateUserData();
        } else {
            const errorDetails = await response.text();
            console.error('API Error Response:', errorDetails);
            alert(`Error: ${errorDetails}`);
        }

    } catch (error) {
        // Show success toast
        showToast();
    }
});

// Call function to populate user data on page load
window.onload = populateUserData;











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
