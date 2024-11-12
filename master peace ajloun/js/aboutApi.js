



    ///////////////////////////
// Function to fetch tourism statistics
async function fetchTourismStatistics() {
    try {
        const response = await fetch('https://localhost:44321/api/TourismStatistics');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.$values;
    } catch (error) {
        console.error('Error fetching tourism statistics:', error);
        return null;
    }
}

// Function to create a stats item
function createStatsItem(prevYear, currentYear, statType, icon) {
    return `
    <div class="stats_item d-flex flex-md-row flex-column clearfix">
      <div class="stats_last order-md-1 order-3">
        <div class="stats_last_icon d-flex flex-column align-items-center justify-content-end">
          <i class="${icon} custom-icon"></i>
        </div>
        <div class="stats_last_content">
          <div class="stats_number">${prevYear[statType]}</div>
          <div class="stats_type">${statType.charAt(0).toUpperCase() + statType.slice(1)}</div>
        </div>
      </div>
      <div class="stats_bar order-md-2 order-2" data-x="${prevYear[statType]}" data-y="${currentYear[statType]}" data-color="${getColor(currentYear[statType + 'ChangePercentage'])}">
        <div class="stats_bar_perc">
          <div>
            <div class="stats_bar_value"></div>
          </div>
        </div>
      </div>
      <div class="stats_new order-md-3 order-1 text-right">
        <div class="stats_new_icon d-flex flex-column align-items-center justify-content-end">
          <i class="${icon} custom-icon"></i>
        </div>
        <div class="stats_new_content">
          <div class="stats_number">${currentYear[statType]}</div>
          <div class="stats_type">${statType.charAt(0).toUpperCase() + statType.slice(1)}</div>
        </div>
      </div>
    </div>
  `;
}

// Function to get color based on change percentage
function getColor(changePercentage) {
    if (changePercentage > 5) return 'darkgreen';
    if (changePercentage > 0) return 'green';
    if (changePercentage < 0) return 'red';
    return 'orange';
}

// Function to populate statistics
async function populateStatistics() {
    const stats = await fetchTourismStatistics();
    if (!stats || stats.length < 2) return;

    const currentYear = stats[0];
    const prevYear = stats[1];

    document.getElementById('currentYear').textContent = currentYear.year;
    document.getElementById('previousYear').textContent = prevYear.year;

    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = '';

    const statTypes = [
        { type: 'clients', icon: 'fas fa-users' },
        { type: 'returningClients', icon: 'fa-solid fa-people-arrows' },
        { type: 'reservations', icon: 'fa-solid fa-paste' },
        { type: 'items', icon: 'fa-solid fa-percent' }
    ];

    statTypes.forEach(({ type, icon }) => {
        statsContainer.innerHTML += createStatsItem(prevYear, currentYear, type, icon);
    });

    // Initialize any JavaScript that depends on the DOM elements being present
    // This might include code to animate the stats bars
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateStatistics);








////////////////////////



// Function to fetch tourism statistics (if not already defined)
async function fetchTourismStatistics() {
    try {
        const response = await fetch('https://localhost:44321/api/TourismStatistics');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.$values;
    } catch (error) {
        console.error('Error fetching tourism statistics:', error);
        return null;
    }
}

// Function to create a milestone item
function createMilestoneItem(icon, value, text) {
    return `
    <div class="col-lg-3 milestone_col">
      <div class="milestone text-center">
        <div class="milestone_icon">
          <img src="${icon}" alt="${text}" />
        </div>
        <div class="milestone_counter" data-end-value="${value}">0</div>
        <div class="milestone_text">${text}</div>
      </div>
    </div>
  `;
}

// Function to populate milestones
async function populateMilestones() {
    const stats = await fetchTourismStatistics();
    if (!stats || stats.length === 0) return;

    const currentYear = stats[0]; // Assuming the first item is the most recent year

    const milestonesContainer = document.getElementById('milestonesContainer');
    milestonesContainer.innerHTML = '';

    const milestones = [
        { icon: 'images/milestone_1.png', value: Math.round(currentYear.clientsChangePercentage * 100), text: 'Clients percentage' },
        { icon: 'images/milestone_2.png', value: currentYear.awwards, text: 'Awards' },
        { icon: 'images/milestone_3.png', value: Math.round(currentYear.returningClientsChangePercentage * 100), text: 'Returning Clients %' },
        { icon: 'images/milestone_4.png', value: currentYear.items, text: 'Items' }
    ];

    milestones.forEach(milestone => {
        milestonesContainer.innerHTML += createMilestoneItem(milestone.icon, milestone.value, milestone.text);
    });

    // Initialize counter animation
    initCounterAnimation();
}

// Function to initialize counter animation
function initCounterAnimation() {
    const counterElements = document.querySelectorAll('.milestone_counter');
    counterElements.forEach(counter => {
        const endValue = parseInt(counter.getAttribute('data-end-value'), 10);
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / endValue));

        const timer = setInterval(() => {
            currentValue += 1;
            counter.textContent = currentValue;
            if (currentValue >= endValue) {
                clearInterval(timer);
                counter.textContent = endValue;
            }
        }, stepTime);
    });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateMilestones);















