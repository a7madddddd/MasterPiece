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

        public ContactMessagesController(MyDbContext context)
        {
            _context = context;
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

        // PUT: api/ContactMessages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ContactMessage>> PostContactMessage(ContactMessage contactMessage)
        {
            _context.ContactMessages.Add(contactMessage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContactMessage", new { id = contactMessage.MessageId }, contactMessage);
        }

        // DELETE: api/ContactMessages/5
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
            // Validate input
            if (contactMessageDto == null || contactMessageDto.UserId <= 0 || string.IsNullOrWhiteSpace(contactMessageDto.Message))
            {
                return BadRequest("User ID and Message are required.");
            }

            // Map DTO to entity
            var contactMessage = new ContactMessage
            {
                Name = contactMessageDto.Name,
                Email = contactMessageDto.Email,
                Subject = contactMessageDto.Subject,
                Message = contactMessageDto.Message,
                UserId = contactMessageDto.UserId,
                SubmittedAt = DateTime.UtcNow
            };

            // Add the message to the context
            _context.ContactMessages.Add(contactMessage);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Handle error (e.g., log it, return an appropriate response)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            // Return the created message with a 201 status code
            return CreatedAtAction(nameof(PostMessageByUserId), new { id = contactMessage.MessageId }, contactMessage);
        }

    }
}
