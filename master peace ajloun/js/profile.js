document.addEventListener('DOMContentLoaded', function () {
    var openPopupButton = document.getElementById('open-popup');
    var popup = document.getElementById('popup');
    var closePopupButton = document.getElementById('close-popup');

    openPopupButton.addEventListener('click', function () {
        console.log("Popup button clicked");

        // Check for JWT in local storage
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            // Stop further execution if JWT is not present
            return;
        }

        // Show the popup if JWT exists
        popup.style.display = 'block';
    });

    closePopupButton.addEventListener('click', function () {
        // Simply hide the popup without storing or alerting
        var name = document.getElementById('name-city').value.trim();
        var email = document.getElementById('email-city').value.trim();
        var date = document.getElementById('date-city').value;
        var guests = document.getElementById('guests-city').value;

        // Check if any field is empty (optional for validation but no alerts)
        if (name === "" || email === "" || date === "" || guests === "") {
            return; // Stop further execution if any field is empty
        }

        // Validate email format (optional for validation but no alerts)
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return; // Stop further execution if email is invalid
        }

        // Validate number of guests (optional for validation but no alerts)
        if (guests <= 0) {
            return; // Stop further execution if the number of guests is invalid
        }

        // Simply hide the popup
        popup.style.display = 'none';
    });
});

///////////////////////////////////

let lastScrollTop = 0;
const bottomBar = document.querySelector('.bottom-bar');

window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        bottomBar.style.transform = 'translateY(100%)';
    } else {
        // Scrolling up
        bottomBar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

// Optional: Make the "Book Now" button in the bar open the popup
document.querySelector('.bar-button').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'block';
});











document.getElementById('open-popup').addEventListener('click', function () {
    // Check for JWT in local storage
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
        // If JWT exists, show the popup
        document.getElementById('popup').style.display = 'block';
    } else {
        // If JWT doesn't exist, show an alert or notification
        Swal.fire({
            icon: 'warning',
            title: 'Access Denied',
            text: 'You must be logged in to book a tour.',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                
                window.location.href = 'login.html';
            }
        });
    
    }
});









