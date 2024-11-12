document.getElementById('contact_form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Get form data
    const name = document.getElementById('contact_form_name').value;
    const email = document.getElementById('contact_form_email').value;
    const subject = document.getElementById('contact_form_subject').value;
    const message = document.getElementById('contact_form_message').value;

    // Send data using Fetch API
    fetch('https://localhost:44321/api/ContactMessages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            message: message
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            return response.json();
        })
        .then(data => {
            // Show success alert using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Message Sent!',
                text: `Thank you ${name} for reaching out. We will get back to you soon.`,
                confirmButtonText: 'OK'
            });

            // Clear the form after submission
            document.getElementById('contact_form').reset();
        })
        .catch(error => {
            console.error('Error:', error);

            // Show error alert using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Something went wrong while sending your message. Please try again later.',
                confirmButtonText: 'OK'
            });
        });
});








///////////////////////////////////// هاي الحالة اذا بدنا id اليوزر /////////////////////////////////////////

    // document.getElementById('contact_form').addEventListener('submit', async function(event) {
    //     event.preventDefault(); // Prevent the default form submission

    // // Get form values
    // const name = document.getElementById('contact_form_name').value;
    // const email = document.getElementById('contact_form_email').value;
    // const subject = document.getElementById('contact_form_subject').value;
    // const message = document.getElementById('contact_form_message').value;

    // // User ID can be retrieved based on your authentication method
    // const userId = 1; // Replace this with the actual user ID

    // // Prepare the data to send
    // const data = {
    //     name: name,
    // email: email,
    // subject: subject,
    // message: message,
    // userId: userId
    //     };

    // try {
    //         // Send the POST request to the API
    //     const response = await fetch('https://localhost:44321/api/ContactMessages/byuserid', {
    //     method: 'POST',
    // headers: {
    //     'Content-Type': 'application/json'
    //             },
    // body: JSON.stringify(data)
    //         });

    // if (response.ok) {
    //             const result = await response.json();
    // console.log('Message sent successfully:', result);
    // alert('Message sent successfully!'); // Show success message
    //         } else {
    //             const error = await response.json();
    // console.error('Error sending message:', error);
    // alert('Failed to send message. Please try again.'); // Show error message
    //         }
    //     } catch (error) {
    //     console.error('Network error:', error);
    // alert('Network error. Please try again.'); // Handle network error
    //     }
    // });






