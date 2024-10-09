using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterPieceApi.Models;
using MasterPieceApi.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Configuration;
using Microsoft.AspNetCore.Http; // Add this for IFormFile
using Microsoft.AspNetCore.Cryptography.KeyDerivation; // For password hashing
using System.Security.Cryptography; // For using Rfc2898DeriveBytes

namespace MasterPieceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;  // Add this field

        public UsersController(MyDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;  // Assign the injected configuration

        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        /// <summary>
        /// ///
        /// </summary>
        /// <param name="searchTerm"></param>
        /// <returns></returns>

        [HttpGet("GetUserByUsernameOrEmail/{searchTerm}")]
        public async Task<ActionResult<User>> GetUserByUsernameOrEmail(string searchTerm)
        {
            // Search for user by username or email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == searchTerm || u.Email == searchTerm);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }





        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }
        /// <summary>
        /// ////////
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }


        /// <summary>
        /// ///////
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        [HttpDelete("username/{username}")]
        public async Task<IActionResult> DeleteUserByUsername(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return NotFound($"User with username {username} not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent(); // Successfully deleted
        }


        /////////////////////////////

        /// <summary>
        /// ///////////
        /// </summary>
        /// <param name="registerDto"></param>
        /// <returns></returns>
        [HttpPost("Register")]
        public IActionResult Register(Register registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Model state not valid.");
            }

            if (string.IsNullOrEmpty(registerDto.Password))
            {
                return BadRequest("Password is required.");
            }

            // Check if a user with the same email already exists
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == registerDto.Email);
            if (existingUser != null)
            {
                return Conflict("User with this email already exists.");
            }

            // Hash the password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var newUser = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                UserRole = "User", // Default role
                ProfileImage = null, // Set or retrieve as needed
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return CreatedAtAction(nameof(Register), new { id = newUser.UserId }, new
            {
                Username = newUser.Username,
                Email = newUser.Email,
                Message = "User registered successfully."
            });
        }

        /// <summary>
        /// ///////////
        /// </summary>
        /// <param name="loginDto"></param>
        /// <returns></returns>
        [HttpPost("Login")]
        public IActionResult Login(LoginDTO loginDto)
        {
            // Ensure the email and password are provided
            if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Return the token and the user's role
            return Ok(new { token, userRole = user.UserRole }); // Make sure UserRole is included in the response
        }

        // Method to generate the JWT token
        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");

            // Get the secret key from appsettings.json
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]));

            // Create signing credentials using the secret key
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            // Create claims for the JWT payload (You can add more claims as needed)
            var claims = new[]
                    {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()), // Use UserId as the subject
                new Claim(JwtRegisteredClaimNames.Name, user.Username), // Add username as a separate claim
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("userId", user.UserId.ToString()), // Keep this custom claim for consistency
                new Claim("UserRole", user.UserRole) // Add UserRole as a claim
            };

            // Define token options
            var tokenOptions = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["ExpirationMinutes"])),
                signingCredentials: signinCredentials
            );

            // Create and return the JWT token
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return tokenString;
        }

        /// <summary>
        /// ////////////////
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("GetUserProfile/{userId}")]
        public async Task<IActionResult> GetUserProfile(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            var userResponse = new UserResponseDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfileImage = user.ProfileImage,
                Phone = user.Phone,
            };
            return Ok(userResponse);
        }
        /// <summary>
        /// ////////////////
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userDto"></param>
        /// <param name="usersImagesFile"></param>
        /// <returns></returns>
        // Your UpdateUserProfile method remains as follows
        [HttpPut("UpdateUserProfile/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromForm] UserResponseDTO userDto, IFormFile? usersImagesFile)
        {
            // Check if the provided userId matches the DTO
            if (userId != userDto.UserId)
            {
                return BadRequest(new { message = "User ID mismatch" });
            }

            // Find the user in the database
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Update user properties if provided
            user.Username = userDto.Username ?? user.Username;
            user.Email = userDto.Email ?? user.Email;
            user.FirstName = userDto.FirstName ?? user.FirstName;
            user.LastName = userDto.LastName ?? user.LastName;
            user.Phone = userDto.Phone ?? user.Phone;

            // Handle file upload for profile image if provided
            if (usersImagesFile != null && usersImagesFile.Length > 0)
            {
                // Directory for storing user images
                var uploadsFolder = @"C:\Users\Orange\Desktop\test_ajloun\master peace ajloun/usersImages/";
                Directory.CreateDirectory(uploadsFolder); // Ensure the directory exists

                var fileName = Guid.NewGuid() + Path.GetExtension(usersImagesFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save the image to the specified folder
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await usersImagesFile.CopyToAsync(stream);
                }

                // Update the user's profile image path
                user.ProfileImage = $"usersImages/{fileName}";
            }

            // Hash the password if it's provided
            if (!string.IsNullOrEmpty(userDto.Password))
            {
                // Hash the new password using BCrypt
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            }

            // Save changes to the database
            var updatedRows = await _context.SaveChangesAsync();

            // Check if any rows were updated
            if (updatedRows > 0)
            {
                return Ok(new { message = "User profile updated successfully" });
            }
            else
            {
                return BadRequest(new { message = "No changes were made to the user profile." });
            }
        }

        // You can delete the following custom method
        // private string HashPassword(string password)
        // {
        //     // Custom hashing logic that is no longer needed
        // }




        /// <summary>
        /// ////////////
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        // GET: api/Bookings/user/{userId}/services
        [HttpGet("user/{userId}/services")]
        public async Task<ActionResult<IEnumerable<UserServiceDto>>> GetServicesByUserId(int userId)
        {
            // Get the list of services booked by the user
            var services = await _context.Bookings
                .Where(b => b.UserId == userId)
                .Include(b => b.Service) // Assuming Booking has a navigation property to Service
                .Select(b => new UserServiceDto
                {
                    ServiceId = b.Service.ServiceId,
                    ServiceName = b.Service.ServiceName,
                    Price = b.Service.Price
                })
                .ToListAsync();

            if (services == null || services.Count == 0)
            {
                return NotFound($"No services found for user with ID {userId}");
            }

            return Ok(services);
        }

        //////////////////////
        //////////////
        ///
        [HttpGet("user/username/{username}/bookings")]
        public async Task<ActionResult<IEnumerable<UsersBookings>>> GetBookingsByUsername(string username)
        {
            // Get the user bookings based on the username
            var bookings = await _context.Bookings
                .Where(b => b.User.Username == username) // Assuming Booking has a navigation property to User
                .Select(b => new UsersBookings
                {
                    BookingId = b.BookingId,
                    BookingDate = b.BookingDate.HasValue ? b.BookingDate.Value.ToDateTime(new TimeOnly(0, 0)) : DateTime.MinValue, // Convert DateOnly to DateTime
                    NumberOfPeople = b.NumberOfPeople,
                    TotalAmount = b.TotalAmount.HasValue ? b.TotalAmount.Value : 0m, // Convert decimal? to decimal with a default value
                    Status = b.Status,
                    Username = b.User.Username, // Assuming User has a Username property
                    ServiceName = b.Service.ServiceName,// Assuming Booking has a navigation property to Service

                })
                .ToListAsync();

            if (bookings == null || bookings.Count == 0)
            {
                return NotFound($"No bookings found for user with username {username}");
            }

            return Ok(bookings);
        }



        [HttpPut("UpdateUserRole/{userId}")]
        public async Task<IActionResult> UpdateUserRole(int userId, [FromBody] UpdateUserRoleDto updateUserRoleDto)
        {
            if (updateUserRoleDto == null || string.IsNullOrEmpty(updateUserRoleDto.UserRole))
            {
                return BadRequest(new { success = false, message = "Invalid user role data." });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found." });
            }

            // Log current and new role
            Console.WriteLine($"Current Role: {user.UserRole}, New Role: {updateUserRoleDto.UserRole}");

            // Check if the role is different before updating
            if (user.UserRole == updateUserRoleDto.UserRole)
            {
                return Ok(new { success = false, message = "No changes to update." });
            }

            user.UserRole = updateUserRoleDto.UserRole;

            try
            {
                // Mark the entity as modified
                _context.Entry(user).State = EntityState.Modified;

                var changes = await _context.SaveChangesAsync();

                if (changes > 0)
                {
                    return Ok(new { success = true, message = "User role updated successfully." });
                }
                else
                {
                    return StatusCode(500, new { success = false, message = "No changes were saved to the database." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                return StatusCode(500, new { success = false, message = "An error occurred while updating the user role." });
            }
        }

    }

}


