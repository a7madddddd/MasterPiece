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
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

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
                Status = bookingDto?.Status ?? "Pending",  // Default status to "Pending" if not provided
                CreatedAt = DateTime.UtcNow  // Set the current UTC time as CreatedAt
            };

            // Add the new booking to the database
            _context.Bookings.Add(newBooking);
            await _context.SaveChangesAsync();

            // Return the created booking details
            return CreatedAtAction(nameof(GetBookingById), new { id = newBooking.BookingId }, newBooking);
        }


        [HttpGet("booking/{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _context.Bookings
                .Where(b => b.BookingId == id)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId ?? 0, // Provide a default value if UserId is nullable
                    ServiceId = b.ServiceId ?? 0, // Provide a default value if ServiceId is nullable
                    BookingDate = b.BookingDate.HasValue
                        ? b.BookingDate.Value.ToDateTime(new TimeOnly(0, 0))
                        : DateTime.MinValue,
                    NumberOfPeople = b.NumberOfPeople ?? 0, // Provide a default value if NumberOfPeople is nullable
                    TotalAmount = b.TotalAmount ?? 0, // Provide a default value if TotalAmount is nullable
                    Status = b.Status ?? string.Empty, // Provide a default value if Status is nullable
                    CreatedAt = b.CreatedAt ?? DateTime.MinValue // Provide a default value if CreatedAt is nullable
                })
                .FirstOrDefaultAsync();

            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            return Ok(booking);
        }

    }
}


    