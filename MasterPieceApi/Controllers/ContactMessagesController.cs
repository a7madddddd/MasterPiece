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
    public class ContactMessagesController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IEmailService _emailService;

        public ContactMessagesController(MyDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;

        }

        // GET: api/ContactMessages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactMessage>>> GetContactMessages()
        {
            return await _context.ContactMessages.ToListAsync();
        }

        // GET: api/ContactMessages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactMessage>> GetContactMessage(int id)
        {
            var contactMessage = await _context.ContactMessages.FindAsync(id);

            if (contactMessage == null)
            {
                return NotFound();
            }

            return contactMessage;
        }

        // PUT: api/ContactMessages
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContactMessage(int id, ContactMessage contactMessage)
        {
            if (id != contactMessage.MessageId)
            {
                return BadRequest();
            }

            _context.Entry(contactMessage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactMessageExists(id))
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

        // POST: api/ContactMessages
        [HttpPost]
        public async Task<ActionResult<ContactMessage>> PostContactMessage(ContactMessage contactMessage)
        {
            _context.ContactMessages.Add(contactMessage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContactMessage", new { id = contactMessage.MessageId }, contactMessage);
        }

        // DELETE: api/ContactMessages/
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContactMessage(int id)
        {
            var contactMessage = await _context.ContactMessages.FindAsync(id);
            if (contactMessage == null)
            {
                return NotFound();
            }

            _context.ContactMessages.Remove(contactMessage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContactMessageExists(int id)
        {
            return _context.ContactMessages.Any(e => e.MessageId == id);
        }


        [HttpPost("byuserid")]
        public async Task<IActionResult> PostMessageByUserId([FromBody] ContactMessageDto contactMessageDto)
        {


            var contactMessage = new ContactMessage
            {
                Name = contactMessageDto.Name,
                Email = contactMessageDto.Email,
                Subject = contactMessageDto.Subject,
                Message = contactMessageDto.Message,
                SubmittedAt = DateTime.UtcNow
            };

            _context.ContactMessages.Add(contactMessage);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return CreatedAtAction(nameof(PostMessageByUserId), new { id = contactMessage.MessageId }, contactMessage);
        }





        /// <summary>
        /// //////////
        /// </summary>
        /// <param name="messageId"></param>
        /// <param name="contactMessageDto"></param>
        /// <returns></returns>
        [HttpPost("replyToMessage/{messageId}")]
        public async Task<IActionResult> SendAdminReply(int messageId, [FromBody] ContactMessageDto contactMessageDto)
        {
            if (contactMessageDto == null || messageId <= 0)
            {
                return BadRequest("Invalid reply data.");
            }

            var contactMessage = await _context.ContactMessages.FirstOrDefaultAsync(m => m.MessageId == messageId);

            if (contactMessage == null)
            {
                return NotFound("Contact message not found.");
            }

            try
            {
                await SendReplyEmail(contactMessageDto); 
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending reply email: {ex.Message}");
                return StatusCode(500, "Error sending reply email.");  
            }

            return Ok("Reply sent successfully.");
        }






        private async Task SendReplyEmail(ContactMessageDto contactMessageDto)
        {
            if (string.IsNullOrEmpty(contactMessageDto.Email))
            {
                Console.WriteLine("Contact email is null or empty.");
                throw new ArgumentException("Email is required.");
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
                                                 <h1 style=""color: #ffffff; margin: 0; font-size: 28px;"">Reply to Your Contact Request</h1>
                                             </td>
                                         </tr>

                                         <!-- Original Message and Admin Reply -->
                                         <tr>
                                             <td style=""padding: 40px 30px;"">
                                                 <h2 style=""color: #333333; margin: 0 0 20px 0; font-size: 24px;"">Hello {contactMessageDto.Name},</h2>

                                                 <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;"">
                                                     Thank you for reaching out to us. Here’s our response to your Contact Request regarding <strong>{contactMessageDto.Subject}</strong>.
                                                 </p>

                                                 <p style=""background-color: #f8f9fa; padding: 20px; border-radius: 6px; color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;"">
                                                     <strong>Your Message:</strong><br>
                                                     {contactMessageDto.Message}
                                                 </p>

                                                 <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin: 20px 0;"">
                                                     <strong>Admin Reply:</strong><br>
                                                     {contactMessageDto.Replay} <!-- This is the admin's reply -->
                                                 </p>

                                                 <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin: 20px 0;"">
                                                     We have received your message and will get back to you as soon as possible. If you have any additional questions, feel free to reply to this email.
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
                await _emailService.SendEmailAsync(contactMessageDto.Email, "Reply to Your Contact Request - Ajloun Tour 360", emailBody);
                Console.WriteLine("Reply email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending reply email: {ex.Message}");
                throw new Exception("Error sending email", ex); // Rethrow exception for higher-level handling
            }
        }


    }
}
