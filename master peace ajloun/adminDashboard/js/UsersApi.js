document.addEventListener('DOMContentLoaded', function () {
    fetch('https://localhost:44321/api/Users')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('userTableBody');
            data.$values.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.userRole}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('userTableBody').innerHTML = '<tr><td colspan="6">Error loading data. Please try again later.</td></tr>';
        });
});










