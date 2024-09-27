using MasterPieceApi.DTOs;
using MasterPieceApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MasterPieceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly string _imagePath = @"C:\Users\Orange\Desktop\test_ajloun\master peace ajloun\services images";

        public ServicesController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services.ToListAsync();
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetService(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        [HttpGet("searchServiceByName")]

        public IActionResult searchSeviceByNAme(string serviceName) {


            var serviceByName = _context.Services.Where(s => s.ServiceName == serviceName);
            return Ok(serviceByName);
        }


        // PUT: api/Services/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutService(int id, Service service)
        {
            if (id != service.ServiceId)
            {
                return BadRequest();
            }

            _context.Entry(service).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
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

        // POST: api/Services
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Service>> PostService(Service service)
        {
            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetService", new { id = service.ServiceId }, service);
        }

        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceExists(int id)
        {
            return _context.Services.Any(e => e.ServiceId == id);
        }

        ////////////////////////////////////


        [HttpGet("most")]
        public async Task<ActionResult<IEnumerable<Service>>> GetMostBookedServices()
        {
            var mostBookedServices = await _context.Services
                .Where(s => s.Most == true)
                .Select(s => new
                {
                    s.ServiceId,
                    s.ServiceName,
                    s.Description,
                    s.Image,
                    s.Dates,
                    s.Question,
                    s.Link,
                })
                .ToListAsync();

            return Ok(mostBookedServices);
        }



        [HttpPost("Dahboard Add Service")]
        public async Task<ActionResult<Service>> PostService([FromForm] ServiceCreateDto serviceDto)
        {
            var service = new Service
            {
                ServiceName = serviceDto.ServiceName,
                Description = serviceDto.Description,
                Price = serviceDto.Price,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = serviceDto.IsActive,  // Set default value or modify as needed
                Description2 = serviceDto.Description2,
                Question = serviceDto.Question,
                Dates = serviceDto.Dates,

            };

            if (serviceDto.ImageFile != null && serviceDto.ImageFile.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(serviceDto.ImageFile.FileName)}";
                var filePath = Path.Combine(_imagePath, fileName);

                // Ensure the directory exists
                Directory.CreateDirectory(_imagePath);

                // Save the file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await serviceDto.ImageFile.CopyToAsync(stream);
                }

                // Set the image path in the service model
                service.Image = $"/services images/{fileName}"; // Adjust the path as needed
            }

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetService", new { id = service.ServiceId }, service);
        }




        [HttpPut("UpdateServiceByName")]
        public async Task<ActionResult<Service>> UpdateServiceByName([FromForm] ServiceCreateDto serviceDto)
        {
            // Find the existing service by name
            var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceName == serviceDto.ServiceName);
            if (service == null)
            {
                return NotFound();
            }

            // Update the service properties
            service.Description = serviceDto.Description;
            service.Price = serviceDto.Price;
            service.Description2 = serviceDto.Description2;
            service.Question = serviceDto.Question;
            service.IsActive = serviceDto.IsActive;
            service.Dates = serviceDto.Dates;
            service.UpdatedAt = DateTime.UtcNow;

            if (serviceDto.ImageFile != null && serviceDto.ImageFile.Length > 0)
            {
                // Generate a unique file name for the uploaded image
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(serviceDto.ImageFile.FileName)}";
                var filePath = Path.Combine(@"C:\Users\Orange\Desktop\test_ajloun\master peace ajloun\services images", fileName);

                // Save the new file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await serviceDto.ImageFile.CopyToAsync(stream);
                }

                // Update the image path in the service model
                service.Image = $"/services images/{fileName}"; // Adjust based on how you serve images
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(service); // Return the updated service
        }

        [HttpDelete("DeleteService/{serviceName}")]
        public async Task<IActionResult> DeleteService(string serviceName)
        {
            var service = await _context.Services.FirstOrDefaultAsync(s => s.ServiceName == serviceName);
            if (service == null)
            {
                return NotFound(new { message = "Service not found." });
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Service deleted successfully." });
        }

    }
}

