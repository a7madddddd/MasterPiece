// Function to fetch offers with services from the API
async function fetchOffersWithServices() {
  try {
    const response = await fetch('https://localhost:44321/api/Offers/AllOffers');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.values?.$values || [];
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}

// Helper function to generate star ratings
function generateStars(rating) {
  let starsHTML = '';
  for (let i = 0; i < 5; i++) {
    starsHTML += i < rating ? '<i class="active"></i>' : '<i></i>';
  }
  return starsHTML;
}

// Function to generate HTML for a single offer with service details
function generateOfferHTML(offer) {
  const imagePath = offer.serviceImage ? offer.serviceImage : 'image/default.jpg';
  const originalPrice = offer.pricePerNight || 0;
  const discountPercentage = offer.discountPercentage || 0;
  const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));

  return `
    <div class="offers_item rating_${Math.round(offer.rating || 0)}">
      <div class="row">
        <div class="col-lg-1 temp_col"></div>
        <div class="col-lg-3 col-1680-4">
          <div class="offers_image_container">
            <div class="offers_image_background" style="background-image:url('${imagePath}');"></div>
            <div class="offer_name"><a href="#">${offer.serviceName}</a></div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="offers_content">
            <div class="offers_price">${discountedPrice.toFixed(2)} jd<span> per tour</span></div>
            <div class="rating_r rating_r_${Math.round(offer.rating || 0)} offers_rating" data-rating="${Math.round(offer.rating || 0)}">
              ${generateStars(Math.round(offer.rating || 0))}
            </div>
            <p class="offers_text">${offer.description || 'No description available.'}</p>
            <div class="offers_icons">
              <ul class="offers_icons_list">
                <li class="offers_icons_item"><img src="images/post.png" alt="Post icon"></li>
                <li class="offers_icons_item"><img src="images/compass.png" alt="Compass icon"></li>
                <li class="offers_icons_item"><img src="images/bicycle.png" alt="Bicycle icon"></li>
              </ul>
            </div>
            <div class="button book_button"><a href="#">book<span></span><span></span><span></span></a></div>
            <div class="offer_reviews">
              <div class="offer_reviews_content">
                <div class="offer_reviews_title">${offer.rating && offer.rating > 8 ? 'very good' : 'good'}</div>
                <div class="offer_reviews_subtitle">${offer.reviewCount || 0} reviews</div>
              </div>
              <div class="offer_reviews_rating text-center">${offer.rating ? offer.rating.toFixed(1) : 'N/A'}</div>
            </div>
            <div class="review_dropdown">
              <select>
                <option value="">Rate this offer...</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to render offers with services into the DOM
async function renderOffersWithServices() {
  const offersContainer = document.getElementById('offersContainer');
  const offers = await fetchOffersWithServices();

  if (offers.length === 0) {
    offersContainer.innerHTML = '<p>No offers available at the moment.</p>';
  } else {
    offersContainer.innerHTML = offers.map(offer => generateOfferHTML(offer)).join('');
  }
}

// Call renderOffersWithServices when the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderOffersWithServices();
});










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
