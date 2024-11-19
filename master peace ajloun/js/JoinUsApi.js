document.getElementById('joinRequestForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch('https://localhost:44321/api/JoinRequests', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${errorText}`);
        }

        const result = await response.json();
        console.log('Join request submitted successfully:', result);
        customAlert('Your request has been submitted successfully!', 'success');

    } catch (error) {
        console.error('Error submitting join request:', error);
        customAlert('There was an error submitting your request. Please try again.', 'error');
    }

});

/////////////////////// alert



function customAlert(message, type = 'info') {
    const options = {
        title: type === 'success' ? 'Success!' : 'Error!',
        text: message,
        icon: type === 'success' ? 'success' : 'error',
        confirmButtonText: 'Okay',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
            
        }
    };

    Swal.fire(options);
}





