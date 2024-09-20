document.addEventListener('DOMContentLoaded', function () {
    var openPopupButton = document.getElementById('open-popup');
    var popup = document.getElementById('popup');
    var closePopupButton = document.getElementById('close-popup');

    openPopupButton.addEventListener('click', function () {
        console.log("Popup button clicked");

        // Check for JWT in local storage
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            Swal.fire({
                icon: 'warning',
                title: 'Access Denied',
                text: 'You must be logged in to book a tour.',
                confirmButtonText: 'OK'
            });
            return; // Stop further execution if JWT is not present
        }

        // Show the popup if JWT exists
        popup.style.display = 'block';
    });

    closePopupButton.addEventListener('click', function () {
        // Validate form inputs
        var name = document.getElementById('name-city').value.trim();
        var email = document.getElementById('email-city').value.trim();
        var date = document.getElementById('date-city').value;
        var guests = document.getElementById('guests-city').value;

        // Check if any field is empty
        if (name === "" || email === "" || date === "" || guests === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields before submitting the booking.'
            });
            return; // Stop further execution if validation fails
        }

        // Validate email format
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a valid email address.'
            });
            return; // Stop further execution if email is invalid
        }

        // Validate number of guests
        if (guests <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a valid number of guests.'
            });
            return; // Stop further execution if the number of guests is invalid
        }

        // If all validations pass, proceed to store the data
        var serviceName = openPopupButton.getAttribute("data-service");
        var serviceImage = openPopupButton.getAttribute("data-image");

        const bookingData = {
            service: serviceName,
            image: serviceImage,
            name: name,
            email: email,
            date: date,
            guests: guests,
        };
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        Swal.fire({
            icon: 'success',
            title: 'Booking Successful',
            text: 'Your booking will be displayed on the profile page.'
        });

        // Hide the popup
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











// document.getElementById('open-popup').addEventListener('click', function () {
//     // Check for JWT in local storage
//     const jwt = localStorage.getItem('jwt');

//     if (jwt) {
//         // If JWT exists, show the popup
//         document.getElementById('popup').style.display = 'block';
//     } else {
//         // If JWT doesn't exist, show an alert or notification
//         Swal.fire({
//             icon: 'warning',
//             title: 'Access Denied',
//             text: 'You must be logged in to book a tour.',
//             confirmButtonText: 'OK'
//         });
//     }
// });


