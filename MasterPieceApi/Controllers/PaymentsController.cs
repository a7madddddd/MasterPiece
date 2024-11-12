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
                ServiceId = paymentDto.ServiceId,
                BookingId = paymentDto.BookingId,
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
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                </head>
                <body style=""margin: 0; padding: 0; background-color: #f4f4f4;"">
                    <table role=""presentation"" style=""width: 100%; border-collapse: collapse; background-color: #f4f4f4; font-family: Arial, sans-serif;"">
                        <tr>
                            <td style=""padding: 40px 0;"">
                                <table role=""presentation"" style=""width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"">
                                    <!-- Header -->
                                    <tr>
                                        <td style=""background-color: #1a4674; padding: 40px 30px; border-radius: 8px 8px 0 0; text-align: center;"">
                                            <h1 style=""color: #ffffff; margin: 0; font-size: 28px;"">Payment Confirmation</h1>
                                        </td>
                                    </tr>
                    
                                    <!-- Content -->
                                    <tr>
                                        <td style=""padding: 40px 30px;"">
                                            <h2 style=""color: #333333; margin: 0 0 20px 0; font-size: 24px;"">Thank you for your payment, {user.Username}!</h2>
                            
                                            <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;"">
                                                We're delighted to confirm your payment for <strong>{service.ServiceName}</strong>.
                                            </p>

                                            <!-- Payment Details Box -->
                                            <table style=""width: 100%; background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;"">
                                                <tr>
                                                    <td style=""padding: 20px;"">
                                                        <h3 style=""color: #1a4674; margin: 0 0 15px 0; font-size: 18px;"">Payment Details</h3>
                                                        <p style=""color: #666666; font-size: 16px; line-height: 1.6; margin: 0;"">
                                                            <strong>Amount:</strong> JD {payment.Amount:F2}<br>
                                                            <strong>Date:</strong> {payment.PaymentDate?.ToString("f") ?? "N/A"}<br>
                                                            <strong>Status:</strong> <span style=""color: #28a745;"">{payment.PaymentStatus}</span><br>
                                                            <strong>Payment Method:</strong> {payment.PaymentMethod}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin: 20px 0;"">
                                                We're thrilled to have you experience Ajloun Tour 360. If you have any questions about your payment or our services, please don't hesitate to contact our support team.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style=""background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #eeeeee;"">
                                            <p style=""color: #999999; font-size: 14px; margin: 0;"">
                                                © 2024 Ajloun Tour 360. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
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

