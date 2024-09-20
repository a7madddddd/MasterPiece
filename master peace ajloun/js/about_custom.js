

/* JS Document */
// document.addEventListener('DOMContentLoaded', () => {
// 	const popup = document.getElementById('popup');
// 	const openPopupBtn = document.getElementById('open-popup');
// 	const closePopupBtn = document.getElementById('close-popup');

// 	openPopupBtn.addEventListener('click', () => {
// 		popup.style.display = 'block';
// 	});

// 	closePopupBtn.addEventListener('click', () => {
// 		popup.style.display = 'none';
// 	});

// 	const serviceName = document.querySelector('.title').getAttribute('data-service');
// 	document.getElementById('service-name').textContent = serviceName;
// });
/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Init Stats
5. Initialize Milestones
6. Init Search Form


******************************/

$(document).ready(function () {
	"use strict";

	/* 

	1. Vars and Inits

	*/

	var menu = $('.menu');
	var menuActive = false;
	var header = $('.header');
	var ctrl = new ScrollMagic.Controller();
	var searchActive = false;

	setHeader();

	$(window).on('resize', function () {
		setHeader();
	});

	$(document).on('scroll', function () {
		setHeader();
	});

	initMenu();
	initStats();
	initMilestones();
	initSearchForm();

	/* 

	2. Set Header

	*/

	function setHeader() {
		if (window.innerWidth < 992) {
			if ($(window).scrollTop() > 100) {
				header.addClass('scrolled');
			}
			else {
				header.removeClass('scrolled');
			}
		}
		else {
			if ($(window).scrollTop() > 100) {
				header.addClass('scrolled');
			}
			else {
				header.removeClass('scrolled');
			}
		}
		if (window.innerWidth > 991 && menuActive) {
			closeMenu();
		}
	}

	/* 

	3. Init Menu

	*/

	function initMenu() {
		if ($('.hamburger').length && $('.menu').length) {
			var hamb = $('.hamburger');
			var close = $('.menu_close_container');

			hamb.on('click', function () {
				if (!menuActive) {
					openMenu();
				}
				else {
					closeMenu();
				}
			});

			close.on('click', function () {
				if (!menuActive) {
					openMenu();
				}
				else {
					closeMenu();
				}
			});


		}
	}

	function openMenu() {
		menu.addClass('active');
		menuActive = true;
	}

	function closeMenu() {
		menu.removeClass('active');
		menuActive = false;
	}

	/* 

	4. Init Stats

	*/

	function initStats() {
		if ($('.stats_item').length) {
			//Get all elements with .stats_item class
			var statsItems = $('.stats_item');

			//Go through each .stats_item
			statsItems.each(function () {
				//Get .stats_bar that is inside the .stats_item
				var item = $(this).find('.stats_bar');
				//Get the element that is going to show the percentage in graph
				var perc = item.find('.stats_bar_perc');
				//Get the element that is going to show the percentage in number
				var val = item.find('.stats_bar_value');
				//Get the first value
				var x = item.attr("data-x");
				//Get the second value
				var y = item.attr("data-y");
				//Get the percentage bar color
				var clr = item.attr("data-color");

				//Get the percentage increase/decrease
				var xPerc = Math.round(((y - x) / x) * 100);
				//If it's a positive value
				if (xPerc > 0) {
					var percBarWidth = xPerc;
					if (xPerc > 100) {
						percBarWidth = 100;
					}
					perc.css('left', "50%");
					perc.css('width', percBarWidth / 2 + "%");
					val.text("+" + xPerc + "%");
					val.css('left', "0");
					val.css('text-align', "left");
				}
				//If it's a negative value
				else {
					xPerc = Math.abs(xPerc);
					var percBarWidth = xPerc;
					if (xPerc > 100) {
						percBarWidth = 100;
					}
					perc.css('right', "50%");
					perc.css('width', percBarWidth / 2 + "%");
					val.text("-" + xPerc + "%");
					val.css('right', "0");
					val.css('text-align', "right");
				}
				perc.css('background', clr);
			});
		}
	}

	/* 

	5. Initialize Milestones

	*/

	function initMilestones() {
		if ($('.milestone_counter').length) {
			var milestoneItems = $('.milestone_counter');

			milestoneItems.each(function (i) {
				var ele = $(this);
				var endValue = ele.data('end-value');
				var eleValue = ele.text();

				/* Use data-sign-before and data-sign-after to add signs
				infront or behind the counter number */
				var signBefore = "";
				var signAfter = "";

				if (ele.attr('data-sign-before')) {
					signBefore = ele.attr('data-sign-before');
				}

				if (ele.attr('data-sign-after')) {
					signAfter = ele.attr('data-sign-after');
				}

				var milestoneScene = new ScrollMagic.Scene({
					triggerElement: this,
					triggerHook: 'onEnter',
					reverse: false
				})
					.on('start', function () {
						var counter = { value: eleValue };
						var counterTween = TweenMax.to(counter, 4,
							{
								value: endValue,
								roundProps: "value",
								ease: Circ.easeOut,
								onUpdate: function () {
									document.getElementsByClassName('milestone_counter')[i].innerHTML = signBefore + counter.value + signAfter;
								}
							});
					})
					.addTo(ctrl);
			});
		}
	}

	/* 

	6. Init Search Form

	*/

	function initSearchForm() {
		if ($('.search_form').length) {
			var searchForm = $('.search_form');
			var searchInput = $('.search_content_input');
			var searchButton = $('.content_search');

			searchButton.on('click', function (event) {
				event.stopPropagation();

				if (!searchActive) {
					searchForm.addClass('active');
					searchActive = true;

					$(document).one('click', function closeForm(e) {
						if ($(e.target).hasClass('search_content_input')) {
							$(document).one('click', closeForm);
						}
						else {
							searchForm.removeClass('active');
							searchActive = false;
						}
					});
				}
				else {
					searchForm.removeClass('active');
					searchActive = false;
				}
			});
		}
	}
});

// document.addEventListener('DOMContentLoaded', function () {
// 	var openPopupButton = document.getElementById('open-popup');
// 	var popup = document.getElementById('popup');
// 	var closePopupButton = document.getElementById('close-popup');


// 	openPopupButton.addEventListener('click', function () {
// 		console.log("This is working");
		
// 		var serviceName = document.getElementById("open-popup").getAttribute("data-service");
// 		var serviceImage = document.getElementById("open-popup").getAttribute("data-image");
// 		console.writeline(serviceName)
// 		console.writeline(serviceImage)

// 		// Store booking details in localStorage
// 		const bookingData = {
// 			service: serviceName,
// 			image: serviceImage,
// 			name: document.getElementById('name-city').value,
// 			email: document.getElementById('email-city').value,
// 			date: document.getElementById('date-city').value,
// 			guests: document.getElementById('guests-city').value,

// 		};
// 		localStorage.setItem('bookingData', JSON.stringify(bookingData));

// 		// Show the popup
// 		popup.style.display = 'block';

// 		// Display the booking details in the popup
// 		const popupContent = document.getElementById('popup-content');
// 		const imageContainer = document.createElement('div');
// 		imageContainer.innerHTML = `<img src="${bookingData.image}" alt="${bookingData.service}" style="width: 100px;">`;

// 		popupContent.innerHTML = `
//             <h3>Your Booking:</h3>
//             <p>Service: ${bookingData.service}</p>
//             ${imageContainer.innerHTML}
//             <p>Name: ${bookingData.name}</p>
//             <p>Email: ${bookingData.email}</p>
//             <p>Date: ${bookingData.date}</p>
//             <p>Number of Guests: ${bookingData.guests}</p>
//         `;
// 		return "";
// 	});

// 	closePopupButton.addEventListener('click', function () {
// 		// Hide the popup
// 		popup.style.display = 'none';
// 	});
// });












// document.addEventListener('DOMContentLoaded', function () {
// 	var openPopupButton = document.getElementById('openPopupButton');

// 	if (openPopupButton) {
// 		openPopupButton.addEventListener('click', function () {
// 			var serviceName = document.getElementById("open-popup").getAttribute("data-service");
// 			var serviceImage = document.getElementById("open-popup").getAttribute("data-image");

// 			// Store booking details in localStorage
// 			const bookingData = {
// 				service: serviceName,
// 				image: serviceImage,
// 				name: document.getElementById('name-city').value,
// 				email: document.getElementById('email-city').value,
// 				date: document.getElementById('date-city').value,
// 				guests: document.getElementById('guests-city').value,
// 			};

// 			// You can then use bookingData as needed
// 		});
// 	} else {
// 		console.error('Element with ID openPopupButton not found');
// 	}
// });









