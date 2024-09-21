using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterPieceApi.Models;

namespace MasterPieceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JoinRequestsController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public JoinRequestsController(MyDbContext context, IWebHostEnvironment environment)
        {
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

        // POST: api/JoinRequests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostJoinRequest([FromForm] JoinRequest joinRequest, IFormFile serviceImage)
        {
            try
            {
                // Specify the directory to save the uploaded files
                var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "JoinUSImages");

                // Check if the directory exists, if not, create it
                if (!Directory.Exists(uploadsDirectory))
                {
                    Directory.CreateDirectory(uploadsDirectory);
                }

                // Save the file if it's not null
                if (serviceImage != null && serviceImage.Length > 0)
                {
                    var filePath = Path.Combine(uploadsDirectory, $"{DateTime.Now.Ticks}_{serviceImage.FileName}");
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await serviceImage.CopyToAsync(fileStream);
                    }
                    joinRequest.ServiceImage = filePath;
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
    }
}
