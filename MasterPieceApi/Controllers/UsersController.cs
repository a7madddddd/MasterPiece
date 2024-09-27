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

            return Ok(new { token });
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
        [HttpPut("UpdateUserProfile/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromForm] UserResponseDTO userDto, IFormFile? usersImagesFile)
        {
            if (userId != userDto.UserId)
            {
                return BadRequest(new { message = "User ID mismatch" });
            }
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Update user properties
            user.Username = userDto.Username ?? user.Username;
            user.Email = userDto.Email ?? user.Email;
            user.FirstName = userDto.FirstName ?? user.FirstName;
            user.LastName = userDto.LastName ?? user.LastName;
            user.Phone = userDto.Phone ?? user.Phone;


            // Handle file upload for profile image
            if (usersImagesFile != null && usersImagesFile.Length > 0)
            {
                // Change the folder path to the specified directory
                var uploadsFolder = @"C:\Users\Orange\Desktop\test_ajloun\master peace ajloun";

                // Create the directory if it does not exist
                Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid() + Path.GetExtension(usersImagesFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await usersImagesFile.CopyToAsync(stream);
                }

                // Update the profile image path (if needed)
                user.ProfileImage = $"/master peace ajloun/{fileName}"; // Adjust this line as necessary
            }

            // Hash the password if provided
            if (!string.IsNullOrEmpty(userDto.Password))
            {
                user.PasswordHash = HashPassword(userDto.Password);
            }

            // Save changes to the database
            await _context.SaveChangesAsync();
            return Ok(new { message = "User profile updated successfully" });
        }
        // Method to hash password
        private string HashPassword(string password)
        {
            // Generate a salt
            var salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Hash the password
            var hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32));

            // Store the salt and hashed password together (you can adjust this based on your database schema)
            return $"{Convert.ToBase64String(salt)}.{hashed}";
        }
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
                    ServiceName = b.Service.ServiceName ,// Assuming Booking has a navigation property to Service

                })
                .ToListAsync();

            if (bookings == null || bookings.Count == 0)
            {
                return NotFound($"No bookings found for user with username {username}");
            }

            return Ok(bookings);
        }




    }
}

