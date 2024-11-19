document.getElementById('contact_form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const name = document.getElementById('contact_form_name').value;
    const email = document.getElementById('contact_form_email').value;
    const subject = document.getElementById('contact_form_subject').value;
    const message = document.getElementById('contact_form_message').value;

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
            
            Swal.fire({
                icon: 'success',
                title: 'Message Sent!',
                text: `Thank you ${name} for reaching out. We will get back to you soon.`,
                confirmButtonText: 'OK'
            });

            
            document.getElementById('contact_form').reset();
        })
        .catch(error => {
            console.error('Error:', error);

            
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Something went wrong while sending your message. Please try again later.',
                confirmButtonText: 'OK'
            });
        });
});






