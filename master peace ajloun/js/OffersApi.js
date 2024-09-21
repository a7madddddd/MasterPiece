// Function to fetch offers from the API
async function fetchOffers() {
    try {
        const response = await fetch('https://localhost:44321/api/Offers');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.$values;
    } catch (error) {
        console.error('Error fetching offers:', error);
        return [];
    }
}

// Function to generate stars based on rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="${i <= rating ? 'filled' : ''}"></i>`;
    }
    return stars;
}

// Function to generate HTML for a single offer
function generateOfferHTML(offer) {
    return `
    <div class="offers_item rating_${Math.round(offer.rating || 0)}">
      <div class="row">
        <div class="col-lg-1 temp_col"></div>
        <div class="col-lg-3 col-1680-4">
          <div class="offers_image_container">
            <div class="offers_image_background" style="background-image:url(${offer.imageUrl || 'image/default.jpg'})"></div>
            <div class="offer_name"><a href="#">${offer.title}</a></div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="offers_content">
            <div class="offers_price">$${offer.pricePerNight || 0}<span>per night</span></div>
            <div class="rating_r rating_r_${Math.round(offer.rating || 0)} offers_rating" data-rating="${Math.round(offer.rating || 0)}">
              ${generateStars(Math.round(offer.rating || 0))}
            </div>
            <p class="offers_text">${offer.description || 'No description available.'}</p>
            <div class="offers_icons">
              <ul class="offers_icons_list">
                ${(offer.amenities || '').split(',').map(amenity =>
        `<li class="offers_icons_item"><img src="images/${amenity.trim()}.png" alt="${amenity.trim()}"></li>`
    ).join('')}
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

// Function to populate offers
async function populateOffers() {
    const offers = await fetchOffers();
    const offersContainer = document.getElementById('offersContainer'); // Make sure to add this id to your container in HTML

    if (offers.length === 0) {
        offersContainer.innerHTML = '<p>No offers available at the moment.</p>';
        return;
    }

    offersContainer.innerHTML = offers.map(generateOfferHTML).join('');
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateOffers);

