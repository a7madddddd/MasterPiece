
// Sign Up functionality
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#sign-up-form').addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const password1 = this.querySelector('input[name="password"]').value;

        const registerDto = {
            username: name, 
            email: email, 
            password: password1, 
            
        };

        try {
            const response = await fetch('https://localhost:44321/api/Users/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerDto), 
            });

            if (!response.ok) {
                
                const errorText = await response.text();
                throw new Error(`${errorText}`);
            }

            
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You have successfully registered.',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById("signIn").click();
                }
            });

           
            this.reset();
        } catch (error) {
            console.error("Registration failed:", error.message);
            
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed!',
                text: ` ${error.message}`,
                confirmButtonText: 'OK'
            });
        }
    });
});








// Login functionality
document.addEventListener('DOMContentLoaded', function () {
    
    document.querySelector('#loginForm').addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const email = document.getElementById('loginUsername').value; 
        const password = document.getElementById('loginPassword').value; 

        const loginDto = {
            Email: email,      
            Password: password  
        };

        try {
            const response = await fetch('https://localhost:44321/api/Users/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDto), 
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: Email Or Password Is Not Valid`);
            }

            const data = await response.json(); 

           
            await Swal.fire({
                icon: 'success',
                title: 'Login successful!',
                text: `Welcome back! ${email}`,
            });

            
            localStorage.setItem('jwt', data.token);


           
            this.reset();

           
            if (data.userRole === 'Admin') {
               
                const result = await Swal.fire({
                    title: 'Continue as Admin or User?',
                    text: 'Please select whether to continue as Admin or User',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'As Admin',
                    cancelButtonText: 'As User',
                });

                
                if (result.isConfirmed) {
                   
                    window.location.href = '../adminDashboard/signin.html';
                } else {
                    window.location.href = document.referrer || 'services.html';
                }

            } else if (data.userRole === 'User') {
                
                window.location.href = document.referrer || 'services.html';
            } else {
                
                console.warn('Unknown role:', data.userRole);
                await Swal.fire({
                    icon: 'warning',
                    title: 'Unknown role',
                    text: `The role ${data.userRole} is not recognized.`,
                });
            }

        } catch (error) {
            console.error("Login failed:", error);
           
            await Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: error.message, 
            });
        }
    });
});








