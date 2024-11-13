using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterPieceApi.Models;
using MasterPieceApi.DTOs;

namespace MasterPieceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public BookingsController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await _context.Bookings.ToListAsync();
        }

        // GET: api/Bookings/5


        // PUT: api/Bookings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, Booking booking)
        {
            if (id != booking.BookingId)
            {
                return BadRequest();
            }

            _context.Entry(booking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
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

        // POST: api/Bookings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking(Booking booking)
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBooking", new { id = booking.BookingId }, booking);
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.BookingId == id);
        }

        // POST: api/Booking
        [HttpPost("bookingtour")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingDto bookingDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the UserId exists
            var user = await _context.Users.FindAsync(bookingDto.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Check if the ServiceId exists
            var service = await _context.Services.FindAsync(bookingDto.ServiceId);
            if (service == null)
            {
                return NotFound(new { message = "Service not found" });
            }

            // Create a new Booking entity
            var newBooking = new Booking
            {
                UserId = bookingDto.UserId,  // Use the UserId from the bookingDto
                ServiceId = bookingDto.ServiceId,
                BookingDate = DateOnly.FromDateTime(bookingDto.BookingDate),  // Convert DateTime to DateOnly
                NumberOfPeople = bookingDto.NumberOfPeople,
                TotalAmount = bookingDto.TotalAmount,
                Status = bookingDto?.Status ?? "Waiting",  // Default status to "Pending" if not provided
                CreatedAt = DateTime.UtcNow  // Set the current UTC time as CreatedAt
            };

            // Add the new booking to the database
            _context.Bookings.Add(newBooking);
            await _context.SaveChangesAsync();

            // Return the created booking details
            return CreatedAtAction(nameof(GetBookingById), new { id = newBooking.BookingId }, newBooking);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _context.Bookings
                .Where(b => b.BookingId == id)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId, 
                    ServiceId = b.ServiceId ?? 0, 
                    BookingDate = b.BookingDate.HasValue ? b.BookingDate.Value.ToDateTime(new TimeOnly(0, 0)) : DateTime.MinValue,
                    NumberOfPeople = b.NumberOfPeople ?? 0, 
                    TotalAmount = b.TotalAmount ?? 0, 
                    Status = b.Status ?? string.Empty, 
                    CreatedAt = b.CreatedAt ?? DateTime.MinValue 
                })
                .FirstOrDefaultAsync();

            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            return Ok(booking);
        }
        // GET: api/Bookings/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetBookingsByUserId(int userId)
        {
            // Check if the user exists
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Retrieve bookings for the given user ID with service details and payment status
            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    ServiceId = b.ServiceId ?? 0,
                    BookingDate = b.BookingDate.HasValue
                        ? b.BookingDate.Value.ToDateTime(new TimeOnly(0, 0))
                        : DateTime.MinValue,
                    NumberOfPeople = b.NumberOfPeople ?? 0,
                    TotalAmount = b.TotalAmount ?? 0,
                    Status = b.Status ?? string.Empty,
                    CreatedAt = b.CreatedAt ?? DateTime.MinValue,

                    // Get the service details
                    ServiceName = _context.Services
                        .Where(s => s.ServiceId == b.ServiceId)
                        .Select(s => s.ServiceName)
                        .FirstOrDefault(),
                    Image = _context.Services
                        .Where(s => s.ServiceId == b.ServiceId)
                        .Select(s => s.Image)
                        .FirstOrDefault(),

                    // Check if payment is completed for this booking
                    PaymentStatus = _context.Payments
                        .Where(p => p.BookingId == b.BookingId && p.UserId == userId)
                        .Select(p => p.PaymentStatus)
                        .FirstOrDefault() == "Completed" ? "Completed" : "Pending"
                })
                .ToListAsync();

            if (!bookings.Any())
            {
                return NotFound(new { message = "No bookings found for this user" });
            }

            return Ok(bookings);
        }



        [HttpGet("UserBookingsDashboard")]
        public async Task<ActionResult<IEnumerable<UsersBookings>>> GetUserBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Service)
                .Select(b => new UsersBookings
                {
                    BookingId = b.BookingId,
                    // Just return BookingDate as DateTime instead of converting to DateOnly
                    BookingDate = b.BookingDate.HasValue ? b.BookingDate.Value.ToDateTime(new TimeOnly(0, 0)) : DateTime.MinValue,

                    NumberOfPeople = b.NumberOfPeople,
                    TotalAmount = b.TotalAmount ?? 0, // Handle null values for TotalAmount
                    Status = b.Status,
                    Username = b.User.FirstName + " " + b.User.LastName, // Combining first and last name
                    ServiceName = b.Service.ServiceName // Assuming ServiceName exists
                }).ToListAsync();

            return Ok(bookings);
        }


        [HttpPut("UpdateStatus/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateModel model)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound();

            booking.Status = model.Status;
            await _context.SaveChangesAsync();

            return Ok(booking);
        }

        public class StatusUpdateModel
        {
            public string Status { get; set; }
        }



        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteBookingDashboard(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking deleted successfully" });
        }
    }
}


