// Function to fetch offers with services from the API
async function fetchOffersWithServices() {
  try {
    const response = await fetch('https://localhost:44321/api/Offers/AllOffers');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response:', data); // Log the response to check its structure

    // Access the offers from values.$values
    return data.values?.$values || []; // Return the offers array, or an empty array if undefined
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

  // Assuming offer.price is the original price and offer.discountPercentage is the discount percentage
  const originalPrice = offer.pricePerNight || 0; // Use the original price
  const discountPercentage = offer.discountPercentage || 0; // Use the discount percentage (default to 0 if not provided)
  const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100)); // Calculate the discounted price

  return `
    <div class="offers_item rating_${Math.round(offer.rating || 0)}">
      <div class="row">
        <div class="col-lg-1 temp_col"></div>
        <div class="col-lg-3 col-1680-4">
          <div class="offers_image_container">
            <div class="offers_image_background" style="background-image:url('${imagePath}') ;position: absolute; left: 0px; top: 0px;"></div>
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
                <li class="offers_icons_item"><img src="images/post.png" alt></li>
                <li class="offers_icons_item"><img src="images/compass.png" alt></li>
                <li class="offers_icons_item"><img src="images/bicycle.png" alt></li>
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

  console.log('Fetched offers:', offers); // Log the fetched offers to inspect its structure

  // Use a Set to track unique service names
  const uniqueServiceNames = new Set();
  const filteredOffers = offers.filter(offer => {
    const isUniqueService = !uniqueServiceNames.has(offer.serviceName); // Change 'serviceName' to your unique property
    uniqueServiceNames.add(offer.serviceName); // Add to the Set
    return isUniqueService; // Keep only unique service names
  });

  if (filteredOffers.length === 0) {
    offersContainer.innerHTML = '<p>No offers available at the moment.</p>';
  } else {
    offersContainer.innerHTML = filteredOffers.map(offer => generateOfferHTML(offer)).join('');
  }
}

// Call renderOffersWithServices when the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderOffersWithServices();
});
