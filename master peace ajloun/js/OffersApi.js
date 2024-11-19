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

async function submitRating(offerId, rating) {
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
        'Authorization': `Bearer ${token}`  
      },
      body: JSON.stringify({
        offerId: offerId,
        rating: rating
      })
    });

    if (!response.ok) throw new Error('Failed to submit rating');

    fetchAndDisplayOffers();
    return true;
  } catch (error) {
    console.error('Error submitting rating:', error);
    showMessage('Failed to submit rating. Please try again.', 'error');
    return false;
  }
}

//fetch offers & update dom
function fetchAndDisplayOffers() {
  fetch('https://localhost:44321/api/Offers/AllOffers')
    .then(response => response.json())
    .then(data => {
      const offers = data.values.$values.filter(offer => offer.isActive);
      const offersGrid = document.querySelector('.offers_grid');

      
      offersGrid.innerHTML = '';

      // append 
      offers.forEach(offer => {
        const imagePath = offer.serviceImage.replace(/\s+/g, '%20');
        const ratingContainerId = `rating-${offer.offerId}`;
        const userRatingContainerId = `user-rating-${offer.offerId}`;

        // Calculate discount
        const discountAmount = offer.pricePerNight * (offer.discountPercentage / 100);
        const discountedPrice = offer.pricePerNight - discountAmount;

        // price and discount
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
                  <span style="font-size = 0.6em; font-weight: bold;">per Tour</span>
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



        const bookButton = offersGrid.querySelector(`[data-offer-id="${offer.offerId}"]`);
        bookButton.addEventListener('click', async (e) => {
          e.preventDefault();
          const offerId = e.currentTarget.dataset.offerId;
          const serviceName = e.currentTarget.dataset.serviceName;
          const serviceImage = e.currentTarget.dataset.serviceImage;
          const price = parseFloat(e.currentTarget.dataset.price);

          await submitBooking(offerId, serviceName, serviceImage, price);
        });


        
        // listeners for rating
        const userRatingContainer = document.getElementById(userRatingContainerId);
        if (userRatingContainer) {
          const stars = userRatingContainer.querySelectorAll('i');

          // effects
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
                
                showMessage('Rating submitted successfully!', 'success');
              } else {
                
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

document.addEventListener('DOMContentLoaded', fetchAndDisplayOffers);










function getUserIdFromToken() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.userId || null; // Adjust this based on your actual JWT payload structure
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// validate service before booking
async function validateService(serviceId, serviceName) {
  try {
    /////////verify by ID
    const responseById = await fetch(`https://localhost:44321/api/Services/${serviceId}`);
    if (responseById.ok) {
      const service = await responseById.json();
      return service;
    }

    // //// by service name
    const responseByName = await fetch(`https://localhost:44321/api/Services/searchServiceByName?serviceName=${encodeURIComponent(serviceName)}`);
    if (responseByName.ok) {
      const services = await responseByName.json();
      // ///// Find service
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
        <div class="modal-header">
          <h2 class="modal-title">Book Tour</h2>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <form id="bookingForm">
            <div class="form-group">
              <label for="numberOfPeople" class="form-label">Number of People:</label>
              <input type="number" id="numberOfPeople" min="1" max="10" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="bookingDate" class="form-label">Booking Date:</label>
              <input type="datetime-local" id="bookingDate" class="form-control" step="86400" required>
            </div>
            <div class="form-group">
              <div class="total-amount">
                Total Amount: <span id="totalAmount">0</span> JD
              </div>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-success submit-booking">Confirm Booking</button>
            </div>
          </form>
          <div id="errorDetails" class="alert alert-danger error-details"></div>
        </div>
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

  // Set current date/time
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
        if (numberOfPeople <= 0 ) {
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

        showMessage('Booking submitted successfully See it on your profile!', 'success');
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


document.head.insertAdjacentHTML('beforeend', modalStyles);
