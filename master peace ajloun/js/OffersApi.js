// Function to create the star rating HTML
function createStarRating(containerId, currentRating, isInteractive = false) {
  const stars = Array(5).fill(0).map((_, index) => {
    const starClass = index < currentRating ? 'active' : '';
    return `<i class="fa fa-star ${starClass}" data-rating="${index + 1}"></i>`;
  }).join('');

  return `<div class="star-rating ${isInteractive ? 'interactive' : ''}" id="${containerId}">
        ${stars}
    </div>`;
}

// Function to handle rating submission
async function submitRating(offerId, rating) {
  try {
    const response = await fetch('https://localhost:44321/api/Offers/AddReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offerId: offerId,
        rating: rating
      })
    });

    if (!response.ok) throw new Error('Failed to submit rating');

    // Refresh the offers display to show updated rating
    fetchAndDisplayOffers();
    return true;
  } catch (error) {
    console.error('Error submitting rating:', error);
    return false;
  }
}

// Function to fetch offers and update the DOM
function fetchAndDisplayOffers() {
  fetch('https://localhost:44321/api/Offers/AllOffers')
    .then(response => response.json())
    .then(data => {
      const offers = data.values.$values.filter(offer => offer.isActive);
      const offersGrid = document.querySelector('.offers_grid');

      // Clear existing content
      offersGrid.innerHTML = '';

      // Create and append offer elements
      offers.forEach(offer => {
        const imagePath = offer.serviceImage.replace(/\s+/g, '%20');
        const ratingContainerId = `rating-${offer.offerId}`;
        const userRatingContainerId = `user-rating-${offer.offerId}`;

        const offerHTML = `
                    <div class="offers_item rating_${offer.rating}">
                        <div class="row">
                            <div class="col-lg-1 temp_col"></div>
                            <div class="col-lg-3 col-1680-4">
                                <div class="offers_image_container">
                                    <div class="offers_image_background" style="background-image: url('${imagePath}')"></div>
                                    <div class="offer_name"><a href="#">${offer.serviceName}</a></div>
                                </div>
                            </div>
                            <div class="col-lg-8">
                                <div class="offers_content">
                                    <div class="offers_price">${offer.pricePerNight} jd<span>per night</span></div>
                                    <div class="rating-container">
                                        <div class="current-rating">
                                            ${createStarRating(ratingContainerId, offer.rating)}
                                        </div>
                                        <div class="user-rating">
                                            <p>Rate this offer:</p>
                                            ${createStarRating(userRatingContainerId, 0, true)}
                                        </div>
                                    </div>
                                    <p class="offers_text">${offer.description}</p>
                                    <div class="offers_icons">
                                        <ul class="offers_icons_list">
                                            <li class="offers_icons_item"><img src="images/post.png" alt=""></li>
                                            <li class="offers_icons_item"><img src="images/compass.png" alt=""></li>
                                            <li class="offers_icons_item"><img src="images/bicycle.png" alt=""></li>
                                        </ul>
                                    </div>
                                    <div class="button book_button">
                                        <a href="#">book<span></span><span></span><span></span></a>
                                    </div>
                                    <div class="offer_reviews">
                                        <div class="offer_reviews_content">
                                            <div class="offer_reviews_title">${offer.reviewCount} reviews</div>
                                            <div class="offer_reviews_subtitle"></div>
                                        </div>
                                        <div class="offer_reviews_rating text-center">${offer.rating * 2}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        offersGrid.insertAdjacentHTML('beforeend', offerHTML);

        // Add event listeners for the interactive rating
        const userRatingContainer = document.getElementById(userRatingContainerId);
        if (userRatingContainer) {
          const stars = userRatingContainer.querySelectorAll('i');

          // Hover effects
          stars.forEach(star => {
            star.addEventListener('mouseover', function () {
              const rating = this.getAttribute('data-rating');
              highlightStars(userRatingContainer, rating);
            });
          });

          userRatingContainer.addEventListener('mouseleave', function () {
            highlightStars(userRatingContainer, 0);
          });

          // Click handler
          stars.forEach(star => {
            star.addEventListener('click', async function () {
              const rating = parseInt(this.getAttribute('data-rating'));
              const success = await submitRating(offer.offerId, rating);
              if (success) {
                // Show success message
                showMessage('Rating submitted successfully!', 'success');
              } else {
                // Show error message
                showMessage('Failed to submit rating. Please try again.', 'error');
              }
            });
          });
        }
      });
    })
    .catch(error => {
      console.error('Error fetching offers:', error);
      const offersGrid = document.querySelector('.offers_grid');
      offersGrid.innerHTML = '<div class="text-center p-4">Failed to load offers</div>';
    });
}

// Helper function to highlight stars
function highlightStars(container, rating) {
  const stars = container.querySelectorAll('i');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
}

// Function to show messages to the user
function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  // Remove the message after 3 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', fetchAndDisplayOffers);





































// Check if JWT is in local storage
document.addEventListener("DOMContentLoaded", function () {
  // Check if the element with ID 'userBox' exists
  const userBox = document.getElementById('userBox');

  if (userBox) {
    // Check if JWT is in local storage
    const token = localStorage.getItem('jwt');

    if (token) {
      // If user is logged in (JWT token found), show profile link
      userBox.innerHTML = `
            <a href="edit_profile.html" id ="profile_icon">Profile</a>         <small style="color: whitesmoke;">|</small>



            <div class="user_box_link">
            <a href="#" id="logoutButton">Logout</a>
            </div>
            `;

      // Attach logout functionality to the "Logout" button
      document.getElementById('logoutButton').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        logout();
      });
    } else {
      // If user is not logged in, show login/register links
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

// Function to handle logout, moved outside of the event listener
function logout() {
  localStorage.removeItem('jwt'); // Remove JWT from local storage
  alert("Logged out successfully!");
  window.location.reload(); // Reload the page to refresh the navbar
}
