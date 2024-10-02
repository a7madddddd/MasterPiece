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

namespace MasterPieceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public PaymentsController(MyDbContext context)
        {
            _context = context;
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
        //public async Task<IActionResult> CreatePayment(int userId, [FromBody] PaymentDto paymentDto)
        //{
        //    if (paymentDto == null || userId <= 0)
        //    {
        //        return BadRequest("Invalid payment data.");
        //    }

        //    // Fetch user details from the database using userId
        //    var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

        //    if (user == null)
        //    {
        //        return NotFound("User not found.");
        //    }

        //    var payment = new Payment
        //    {
        //        UserId = userId,
        //        Amount = paymentDto.Amount,
        //        PaymentDate = DateTime.Now,
        //        PaymentStatus = paymentDto.PaymentStatus,
        //        PaymentMethod = paymentDto.PaymentMethod,
        //        ServiceId = paymentDto.ServiceId
        //    };

        //    // Save the payment to the database
        //    await _context.Payments.AddAsync(payment);
        //    await _context.SaveChangesAsync();

        //    // Send payment confirmation email
        //    try
        //    {
        //        var service = await _context.Services
        //                            .FirstOrDefaultAsync(s => s.ServiceId == paymentDto.ServiceId);

        //        if (service != null)
        //        {
        //            await SendPaymentConfirmationEmail(user, payment, service);
        //        }
        //        else
        //        {
        //            Console.WriteLine("Service not found.");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the error
        //        Console.WriteLine($"Error sending payment confirmation email: {ex.Message}");
        //        // Note: Do not fail the payment creation process due to email issues
        //    }

        //    return CreatedAtAction(nameof(CreatePayment), new { id = payment.PaymentId }, payment);
        //}

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
            // To delete the booking
            _context.Bookings.Remove(booking);

            // Or, to update the booking status, you might have a field like IsPaid or Status
            // booking.Status = "Paid"; // Or any other status to indicate payment has been made
            // _context.Bookings.Update(booking);

            // Save changes to remove the booking
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
                // Log the error
                Console.WriteLine($"Error sending payment confirmation email: {ex.Message}");
                // Note: Do not fail the payment creation process due to email issues
            }

            return CreatedAtAction(nameof(CreatePayment), new { id = payment.PaymentId }, payment);
        }




        // Method to send payment confirmation email
        private async Task SendPaymentConfirmationEmail(User user, Payment payment, Service service)
    {
        if (string.IsNullOrEmpty(user.Email))
        {
            Console.WriteLine("User email is null or empty.");
            return; // Exit the method if email is invalid
        }

            var emailBody = $@"
            <!DOCTYPE html>
            <html lang=""en"">
            <head>
                <meta charset=""UTF-8"">
                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                <title>Payment Confirmation - Ajloun Tour 360</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

                    body {{
                        font-family: 'Roboto', Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f7f9;
                        color: #333333;
                        line-height: 1.6;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    }}
                    .header {{
                        background-color: #3498db;
                        color: #ffffff;
                        padding: 30px;
                        text-align: center;
                    }}
                    .header h1 {{
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                    }}
                    .content {{
                        padding: 30px;
                    }}
                    h2 {{
                        color: #2c3e50;
                        font-size: 22px;
                        margin-top: 0;
                    }}
                    p {{
                        margin-bottom: 20px;
                    }}
                    .service-details, .payment-details {{
                        background-color: #f8f9fa;
                        border-radius: 6px;
                        padding: 20px;
                        margin-bottom: 20px;
                    }}
                    .service-details h3, .payment-details h3 {{
                        margin-top: 0;
                        color: #2c3e50;
                        font-size: 18px;
                    }}
                    ul {{
                        list-style-type: none;
                        padding: 0;
                    }}
                    li {{
                        margin-bottom: 10px;
                    }}
                    .service-image {{
                        width: 100%;
                        height: auto;
                        border-radius: 6px;
                        margin-bottom: 20px;
                    }}
                    .highlight {{
                        font-weight: 700;
                        color: #3498db;
                    }}
                    .footer {{
                        background-color: #34495e;
                        color: #ffffff;
                        text-align: center;
                        padding: 20px;
                        font-size: 14px;
                    }}
                    .footer p {{
                        margin: 5px 0;
                    }}
                    .button {{
                        display: inline-block;
                        background-color: #3498db;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        font-weight: 700;
                        margin-top: 20px;
                    }}
                </style>
            </head>
            <body>
                <div class=""container"">
                    <div class=""header"">
                        <h1>Payment Confirmation</h1>
                    </div>
                    <div class=""content"">
                        <h2>Thank you for your payment, {user.Username}!</h2>
                        <p>We're excited to confirm that we've received your payment of <span class=""highlight"">JD {payment.Amount:F2}</span> for the following service:</p>

                        <div class=""service-details"">
                            <h3>Service Details</h3>
                            <ul>
                                <li><strong>Service:</strong> {service.ServiceName}</li>
                                <li><strong>Price:</strong> JD {service.Price:F2}</li>
                            </ul>
                        </div>

                        <img src=""{service.Image}"" alt=""{service.ServiceName}"" class=""service-image"" />

                        <div class=""payment-details"">
                            <h3>Payment Information</h3>
                            <ul>
                                <li><strong>Payment ID:</strong> {payment.PaymentId}</li>
                                <li><strong>Date:</strong> {(payment.PaymentDate?.ToString("f") ?? "N/A")}</li>
                                <li><strong>Status:</strong> {payment.PaymentStatus}</li>
                                <li><strong>Method:</strong> {payment.PaymentMethod}</li>
                            </ul>
                        </div>

                        <p>If you have any questions or need further assistance, please don't hesitate to contact our support team. We're here to help!</p>

                        <a href=""https://ajlountour360.com/contact"" class=""button"">Contact Support</a>
                    </div>
                    <div class=""footer"">
                        <p>Thank you for choosing Ajloun Tour 360</p>
                        <p>&copy; 2024 Ajloun Tour 360. All rights reserved For Ahmad Onizat.</p>
                    </div>
                </div>
            </body>
            </html>
            ";




            var emailMessage = new MailMessage
        {
            From = new MailAddress("ajlountour@gmail.com"),
            Subject = "Payment Confirmation",
            Body = emailBody,
            IsBodyHtml = true
        };
        emailMessage.To.Add(user.Email); // User's email

        using var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587, // Standard port for TLS
            Credentials = new NetworkCredential("ajlountour@gmail.com", "vtlh hmgs geta srzp"), // Use app password if 2FA is enabled
            EnableSsl = true,
        };

        try
        {
            Console.WriteLine($"Sending email to: {user.Email}");
            await smtpClient.SendMailAsync(emailMessage);
            Console.WriteLine("Email sent successfully.");
        }
        catch (SmtpException smtpEx)
        {
            Console.WriteLine($"SMTP Error: {smtpEx.StatusCode} - {smtpEx.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending payment confirmation email: {ex.Message}, Stack Trace: {ex.StackTrace}");
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

