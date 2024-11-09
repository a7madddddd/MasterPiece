using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterPieceApi.Models;
using MasterPieceApi.DTOs;
using System.Net.Mail;
using System.Net;
using System.Diagnostics.Contracts;

namespace MasterPieceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IEmailService _emailService;

        public PaymentsController(MyDbContext context, IEmailService emailService)
        {

            _context = context;
            _emailService = emailService;
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            return await _context.Payments.ToListAsync();
        }

        // GET: api/Payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // PUT: api/Payments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.PaymentId)
            {
                return BadRequest();
            }

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
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

        // POST: api/Payments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayment", new { id = payment.PaymentId }, payment);
        }

        // DELETE: api/Payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(e => e.PaymentId == id);
        }









        // POST: api/payments/paymentByUserId
        // POST: api/payments/paymentByUserId


        [HttpPost("paymentByUserId/{userId}")]
        public async Task<IActionResult> CreatePayment(int userId, [FromBody] PaymentDto paymentDto)
        {
            if (paymentDto == null || userId <= 0)
            {
                return BadRequest("Invalid payment data.");
            }

            // Fetch user details from the database using userId
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Fetch the associated booking using the serviceId from paymentDto
            var booking = await _context.Bookings
                                         .FirstOrDefaultAsync(b => b.ServiceId == paymentDto.ServiceId && b.UserId == userId);

            if (booking == null)
            {
                return NotFound("Booking not found.");
            }

            // Create the payment record
            var payment = new Payment
            {
                UserId = userId,
                Amount = paymentDto.Amount,
                PaymentDate = DateTime.Now,
                PaymentStatus = paymentDto.PaymentStatus,
                PaymentMethod = paymentDto.PaymentMethod,
                ServiceId = paymentDto.ServiceId
            };

            // Save the payment to the database
            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();

            // Optionally, remove the booking record or update its status
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            // Send payment confirmation email
            try
            {
                var service = await _context.Services
                                    .FirstOrDefaultAsync(s => s.ServiceId == paymentDto.ServiceId);

                if (service != null)
                {
                    await SendPaymentConfirmationEmail(user, payment, service);
                }
                else
                {
                    Console.WriteLine("Service not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending payment confirmation email: {ex.Message}");
            }

            return CreatedAtAction(nameof(CreatePayment), new { id = payment.PaymentId }, payment);
        }

        // Updated method to send payment confirmation email using the email service
        private async Task SendPaymentConfirmationEmail(User user, Payment payment, Service service)
        {
            if (string.IsNullOrEmpty(user.Email))
            {
                Console.WriteLine("User email is null or empty.");
                return;
            }

            var emailBody = $@"
            <!DOCTYPE html>
            <html lang=""en"">
            <body>
                <div style='font-family: Arial, sans-serif;'>
                    <h2>Thank you for your payment, {user.Username}!</h2>
                    <p>We've received your payment of JD {payment.Amount:F2} for {service.ServiceName}.</p>
                    <p><strong>Payment Information:</strong><br>
                    Date: {payment.PaymentDate?.ToString("f") ?? "N/A"}<br>
                    Status: {payment.PaymentStatus}<br>
                    Method: {payment.PaymentMethod}</p>
                    <p>Thank you for choosing Ajloun Tour 360.</p>
                </div>
            </body>
            </html>";

            try
            {
                await _emailService.SendEmailAsync(user.Email, "Payment Confirmation - Ajloun Tour 360", emailBody);
                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
            }
        }























        /// <summary>
        /// ////////////
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [HttpGet("userPayment/{id}")]
        public IActionResult GetUserPayment(int id)
        {
            // Fetch payments with related service data using the provided user ID
            var payments = _context.Payments
                .Where(p => p.UserId == id)
                .Select(p => new
                {
                    p.PaymentId,
                    p.UserId,
                    p.Amount,
                    PaymentDate = p.PaymentDate,
                    p.PaymentStatus,
                    ServiceName = p.Service.ServiceName // Access the service name directly
                })
                .ToList();

            if (payments == null || payments.Count == 0)
            {
                return NotFound(new { message = "No payments found for this user." });
            }

            return Ok(payments);
        }


    }
}

