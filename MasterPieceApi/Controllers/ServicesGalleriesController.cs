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
    public class ServicesGalleriesController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ServicesGalleriesController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/ServicesGalleries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServicesGallery>>> GetServicesGalleries()
        {
            return await _context.ServicesGalleries.ToListAsync();
        }

        // GET: api/ServicesGalleries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServicesGallery>> GetServicesGallery(int id)
        {
            var servicesGallery = await _context.ServicesGalleries.FindAsync(id);

            if (servicesGallery == null)
            {
                return NotFound();
            }

            return servicesGallery;
        }

        // PUT: api/ServicesGalleries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServicesGallery(int id, ServicesGallery servicesGallery)
        {
            if (id != servicesGallery.GalleryId)
            {
                return BadRequest();
            }

            _context.Entry(servicesGallery).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServicesGalleryExists(id))
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

        // POST: api/ServicesGalleries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ServicesGallery>> PostServicesGallery(ServicesGallery servicesGallery)
        {
            _context.ServicesGalleries.Add(servicesGallery);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetServicesGallery", new { id = servicesGallery.GalleryId }, servicesGallery);
        }

        // DELETE: api/ServicesGalleries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicesGallery(int id)
        {
            var servicesGallery = await _context.ServicesGalleries.FindAsync(id);
            if (servicesGallery == null)
            {
                return NotFound();
            }

            _context.ServicesGalleries.Remove(servicesGallery);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServicesGalleryExists(int id)
        {
            return _context.ServicesGalleries.Any(e => e.GalleryId == id);
        }
    }
}
