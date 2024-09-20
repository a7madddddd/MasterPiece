﻿using System;
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

            // Hash the password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var newUser = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                FirstName = null, // Set or retrieve as needed
                LastName = null,  // Set or retrieve as needed
                UserRole = "User", // Default role, change as necessary
                ProfileImage = null, // Set or retrieve as needed
                Phone = null // Set or retrieve as needed
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok("User registered successfully.");
        }






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
        new Claim(JwtRegisteredClaimNames.Sub, user.Username),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
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



    }
}
