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
    public class JoinRequestsController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IEmailService _emailService;

        public JoinRequestsController(MyDbContext context, IWebHostEnvironment environment, IEmailService emailService)
        {
            _emailService = emailService;
            _context = context;
            _environment = environment;
        }

        // GET: api/JoinRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JoinRequest>>> GetJoinRequests()
        {
            return await _context.JoinRequests.ToListAsync();
        }

        // GET: api/JoinRequests/5
        // Add this method to retrieve a specific join request (optional)
        [HttpGet("{id}")]
        public async Task<ActionResult<JoinRequest>> GetJoinRequest(int id)
        {
            var joinRequest = await _context.JoinRequests.FindAsync(id);

            if (joinRequest == null)
            {
                return NotFound();
            }

            return joinRequest;
        }

        // PUT: api/JoinRequests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJoinRequest(int id, JoinRequest joinRequest)
        {
            if (id != joinRequest.RequestId)
            {
                return BadRequest();
            }

            _context.Entry(joinRequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JoinRequestExists(id))
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

        [HttpPost]
        public async Task<IActionResult> PostJoinRequest([FromForm] JoinRequest joinRequest, IFormFile serviceImage)
        {
            try
            {
                // Specify the directory to save the uploaded files
                var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "JoinUSImages");

                // Check if the directory exists, if not, create it
                if (!Directory.Exists(uploadsDirectory))
                {
                    Directory.CreateDirectory(uploadsDirectory);
                }

                // Save the file if it's not null
                if (serviceImage != null && serviceImage.Length > 0)
                {
                    var fileName = $"{DateTime.Now.Ticks}_{serviceImage.FileName}";
                    var filePath = Path.Combine(uploadsDirectory, fileName);

                    // Save the file to the specified path
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await serviceImage.CopyToAsync(fileStream);
                    }

                    // Store only the relative path to the image in the database
                    joinRequest.ServiceImage = $"JoinUSImages/{fileName}";
                }

                // Save the join request to the database
                _context.JoinRequests.Add(joinRequest);
                await _context.SaveChangesAsync();

                return Ok(joinRequest);
            }
            catch (Exception ex)
            {
                // Return the error message if something went wrong
                return StatusCode(500, new { message = $"Internal Server Error: {ex.Message}" });
            }
        }




        // DELETE: api/JoinRequests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJoinRequest(int id)
        {
            var joinRequest = await _context.JoinRequests.FindAsync(id);
            if (joinRequest == null)
            {
                return NotFound();
            }

            _context.JoinRequests.Remove(joinRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JoinRequestExists(int id)
        {
            return _context.JoinRequests.Any(e => e.RequestId == id);
        }




        /// <summary>
        /// ///////////////////
        /// </summary>
        /// <param name="requestId"></param>
        /// <param name="adminReply"></param>
        /// <returns></returns>
        [HttpPost("replyToJoinRequest/{requestId}")]
        public async Task<IActionResult> SendAdminReply(int requestId, [FromBody] string adminReply)
        {
            if (string.IsNullOrEmpty(adminReply) || requestId <= 0)
            {
                return BadRequest("Invalid reply data.");
            }

            // Fetch the original join request from the database using requestId
            var joinRequest = await _context.JoinRequests.FirstOrDefaultAsync(r => r.RequestId == requestId);

            if (joinRequest == null)
            {
                return NotFound("Join request not found.");
            }
            // Create the email body
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
                                                 <h1 style=""color: #ffffff; margin: 0; font-size: 28px;"">Reply to Your Join Request</h1>
                                             </td>
                                         </tr>

                                         <!-- Original Message and Admin Reply -->
                                         <tr>
                                             <td style=""padding: 40px 30px;"">
                                                 <h2 style=""color: #333333; margin: 0 0 20px 0; font-size: 24px;"">Hello {joinRequest.Name},</h2>

                                                 <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;"">
                                                     Thank you for reaching out to us. Here’s our response to your join request.
                                                 </p>

                                                 <p style=""background-color: #f8f9fa; padding: 20px; border-radius: 6px; color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;"">
                                                     <strong>Your Message:</strong><br>
                                                     {joinRequest.Message}
                                                 </p>

                                                 <p style=""color: #666666; font-size: 16px; line-height: 1.5; margin: 20px 0;"">
                                                     <strong>Admin Reply:</strong><br>
                                                     {adminReply}
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
                // Assuming _emailService is correctly injected
                await _emailService.SendEmailAsync(joinRequest.Email, "Reply to Your Join Request", emailBody);
                return Ok("Reply sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error sending reply email.");
            }
        }




    }
}
