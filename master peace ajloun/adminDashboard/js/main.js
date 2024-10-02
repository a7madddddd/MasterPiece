(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });

    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });

    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav: false
    });

    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";

    // Function to fetch payment data
    async function fetchPayments() {
        const response = await fetch('https://localhost:44321/api/Payments');
        if (!response.ok) {
            console.error('Error fetching payments:', response.statusText);
            return [];
        }
        const data = await response.json();
        return data.$values || [];
    }

    // Prepare data for Worldwide Sales Chart
    function prepareWorldwideSalesData(payments) {
        const salesData = Array(12).fill(0); // 12 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        payments.forEach(payment => {
            const paymentDate = new Date(payment.paymentDate);
            const monthIndex = paymentDate.getMonth();
            salesData[monthIndex] += payment.amount;
        });

        return { months, salesData };
    }

    // Prepare data for Sales & Revenue Chart
    function prepareSalesAndRevenueData(payments) {
        const salesData = Array(12).fill(0);
        const revenueData = Array(12).fill(0);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        payments.forEach(payment => {
            const paymentDate = new Date(payment.paymentDate);
            const monthIndex = paymentDate.getMonth();
            salesData[monthIndex]++;
            revenueData[monthIndex] += payment.amount;
        });

        return { months, salesData, revenueData };
    }

    // Function to update charts with fetched data
    async function updateCharts() {
        const payments = await fetchPayments();

        // Worldwide Sales Chart
        const { months, salesData } = prepareWorldwideSalesData(payments);
        var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
        new Chart(ctx1, {
            type: "bar",
            data: {
                labels: months,
                datasets: [{
                    label: "Sales",
                    data: salesData,
                    backgroundColor: "rgba(0, 100, 0, .7)"
                }]
            },
            options: { responsive: true }
        });

        // Sales & Revenue Chart
        const { salesData: sales, revenueData } = prepareSalesAndRevenueData(payments);
        var ctx2 = $("#salse-revenue").get(0).getContext("2d");
        new Chart(ctx2, {
            type: "line",
            data: {
                labels: months,
                datasets: [{
                    label: "Sales",
                    data: sales,
                    backgroundColor: "rgba(0, 100, 0, .7)",
                    fill: true
                },
                {
                    label: "Revenue",
                    data: revenueData,
                    backgroundColor: "rgba(0, 100, 0, .5)",
                    fill: true
                }]
            },
            options: { responsive: true }
        });
    }

    // Call updateCharts on document ready
    $(document).ready(() => {
        updateCharts();
    });

})(jQuery);
