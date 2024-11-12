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
  // Check if user is logged in by verifying JWT token in localStorage
  const token = localStorage.getItem('jwt');
  if (!token) {
    showMessage('You need to log in first to submit a review.', 'error');
    return false;
  }

  try {
    const response = await fetch('https://localhost:44321/api/Offers/AddReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Send JWT token in Authorization header
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
    showMessage('Failed to submit rating. Please try again.', 'error');
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

        // Calculate the discounted price
        const discountAmount = offer.pricePerNight * (offer.discountPercentage / 100);
        const discountedPrice = offer.pricePerNight - discountAmount;

        // HTML structure with price and discount
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
                  <div class="offers_price">
                  ${offer.discountPercentage > 0 ?
                            `<span class="original-price">${offer.pricePerNight} jd</span>` : ''}
                  <span class="discounted-price">${discountedPrice.toFixed(2)} jd</span>
                  <span>per Tour</span>
                </div>

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
                    <a href="#"
                      data-offer-id="${offer.offerId}"
                      data-service-name="${offer.serviceName}"
                      data-service-image="${imagePath}"
                      data-price="${discountedPrice}"
                    >book<span></span><span></span><span></span></a>
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
        `;


        offersGrid.insertAdjacentHTML('beforeend', offerHTML);



        // Add event listener for the book button
        const bookButton = offersGrid.querySelector(`[data-offer-id="${offer.offerId}"]`);
        bookButton.addEventListener('click', async (e) => {
          e.preventDefault();
          const offerId = e.currentTarget.dataset.offerId;
          const serviceName = e.currentTarget.dataset.serviceName;
          const serviceImage = e.currentTarget.dataset.serviceImage;
          const price = parseFloat(e.currentTarget.dataset.price);

          await submitBooking(offerId, serviceName, serviceImage, price);
        });


        
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
                showMessage('You need to log in first to submit a review.', 'error');
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









// Modified submitBooking function with enhanced error handling
// Function to get userId from JWT token
// Function to get userId from JWT token
function getUserIdFromToken() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;

  try {
    // Decode the JWT token to get the payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.userId || null; // Adjust this based on your actual JWT payload structure
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Function to validate service before booking
async function validateService(serviceId, serviceName) {
  try {
    // First try to verify by ID
    const responseById = await fetch(`https://localhost:44321/api/Services/${serviceId}`);
    if (responseById.ok) {
      const service = await responseById.json();
      return service;
    }

    // If ID not found, try to search by name
    const responseByName = await fetch(`https://localhost:44321/api/Services/searchServiceByName?serviceName=${encodeURIComponent(serviceName)}`);
    if (responseByName.ok) {
      const services = await responseByName.json();
      // Find the matching service
      const matchingService = services.find(s => s.serviceName.toLowerCase() === serviceName.toLowerCase());
      if (matchingService) {
        return matchingService;
      }
    }

    throw new Error('Service not found. Please try again later.');
  } catch (error) {
    console.error('Error validating service:', error);
    throw new Error('Failed to validate service. Please try again.');
  }
}

async function submitBooking(offerId, serviceName, serviceImage, pricePerTour) {
  const token = localStorage.getItem('jwt');
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    showMessage('You need to log in first to make a booking.', 'error');
    return false;
  }

  // Validate service before showing booking modal
  try {
    const validatedService = await validateService(offerId, serviceName);
    console.log('Validated service:', validatedService);

    // Use the validated service ID instead of the original offerId
    offerId = validatedService.id || validatedService.serviceId;

    if (!offerId) {
      throw new Error('Invalid service ID');
    }
  } catch (error) {
    showMessage(error.message, 'error');
    return false;
  }

  const modalHTML = `
    <div class="booking-modal" id="bookingModal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Book Tour</h2>
        <form id="bookingForm">
          <div class="form-group">
            <label for="numberOfPeople">Number of People:</label>
            <input type="number" id="numberOfPeople" min="1" required>
          </div>
          <div class="form-group">
            <label for="bookingDate">Booking Date:</label>
            <input type="datetime-local" id="bookingDate" required>
          </div>
          <div class="total-amount">
            Total Amount: <span id="totalAmount">0</span> JD
          </div>
          <button type="submit" class="submit-booking">Confirm Booking</button>
        </form>
        <div id="errorDetails" class="error-details"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('bookingModal');
  const closeBtn = modal.querySelector('.close-modal');
  const form = document.getElementById('bookingForm');
  const numberOfPeopleInput = document.getElementById('numberOfPeople');
  const totalAmountSpan = document.getElementById('totalAmount');
  const errorDetails = document.getElementById('errorDetails');

  // Set min datetime to current date/time
  const bookingDateInput = document.getElementById('bookingDate');
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  bookingDateInput.min = localDateTime;
  bookingDateInput.value = localDateTime;

  modal.style.display = 'block';

  numberOfPeopleInput.addEventListener('input', () => {
    const numberOfPeople = parseInt(numberOfPeopleInput.value) || 0;
    const totalAmount = numberOfPeople * pricePerTour;
    totalAmountSpan.textContent = totalAmount.toFixed(2);
  });

  closeBtn.onclick = () => modal.remove();
  window.onclick = (event) => {
    if (event.target === modal) modal.remove();
  };

  return new Promise((resolve) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDetails.innerHTML = '';

      try {
        const numberOfPeople = parseInt(numberOfPeopleInput.value);
        if (numberOfPeople <= 0) {
          throw new Error('Number of people must be greater than 0');
        }

        const bookingDateTime = new Date(document.getElementById('bookingDate').value);
        if (bookingDateTime < new Date()) {
          throw new Error('Booking date cannot be in the past');
        }

        const totalAmount = numberOfPeople * pricePerTour;

        const requestPayload = {
          bookingId: 0,
          userId: userId,
          serviceId: parseInt(offerId),
          bookingDate: bookingDateTime.toISOString(),
          numberOfPeople: numberOfPeople,
          totalAmount: totalAmount,
          status: "pending",
          createdAt: new Date().toISOString(),
          serviceName: serviceName,
          image: serviceImage,
          paymentStatus: "pending"
        };

        console.log('Sending booking request:', requestPayload);

        const response = await fetch('https://localhost:44321/api/Bookings/bookingtour', {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestPayload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error response:', errorText);

          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || 'Failed to submit booking');
          } catch (e) {
            throw new Error('Server error: ' + (errorText || response.status));
          }
        }

        const responseData = await response.json();
        console.log('Booking response:', responseData);

        showMessage('Booking submitted successfully!', 'success');
        modal.remove();
        resolve(true);

      } catch (error) {
        console.error('Error submitting booking:', error);
        errorDetails.innerHTML = `
          <div class="error-message">
            ${error.message || 'Failed to submit booking. Please try again.'}
          </div>
        `;
        showMessage('Failed to submit booking. Check details below.', 'error');
        resolve(false);
      }
    });
  });
}

// The getUserIdFromToken and modal styles remain the same...

// CSS styles remain the same as before...
const modalStyles = `
  <style>
    .booking-modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
    }

    .modal-content {
      background-color: white;
      margin: 15% auto;
      padding: 20px;
      border-radius: 5px;
      width: 80%;
      max-width: 500px;
      position: relative;
    }

    .close-modal {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 24px;
      cursor: pointer;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
    }

    .form-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .total-amount {
      margin: 15px 0;
      font-weight: bold;
    }

    .submit-booking {
      background-color: #fa9e1b;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
    }

    .submit-booking:hover {
      background-color: #e89016;
    }

    .error-details {
      margin-top: 15px;
      color: #dc3545;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 10px;
      display: none;
    }

    .error-details:not(:empty) {
      display: block;
    }

    .error-message {
      margin: 5px 0;
      font-size: 14px;
    }
  </style>
`;
// Rest of the code remains the same...

// Add the styles to the document head
document.head.insertAdjacentHTML('beforeend', modalStyles);





















