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
    public class OffersController : ControllerBase
    {
        private readonly MyDbContext _context;

        public OffersController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Offers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Offer>>> GetOffers()
        {
            return await _context.Offers.ToListAsync();
        }

        // GET: api/Offers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Offer>> GetOffer(int id)
        {
            var offer = await _context.Offers.FindAsync(id);

            if (offer == null)
            {
                return NotFound();
            }

            return offer;
        }

        // PUT: api/Offers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOffer(int id, Offer offer)
        {
            if (id != offer.OfferId)
            {
                return BadRequest();
            }

            _context.Entry(offer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OfferExists(id))
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

        // POST: api/Offers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Offer>> PostOffer(Offer offer)
        {
            _context.Offers.Add(offer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOffer", new { id = offer.OfferId }, offer);
        }

        // DELETE: api/Offers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffer(int id)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null)
            {
                return NotFound();
            }

            _context.Offers.Remove(offer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OfferExists(int id)
        {
            return _context.Offers.Any(e => e.OfferId == id);
        }


        [HttpGet("AllOffers")]
        public IActionResult GetOffersWithServices()
        {
            var offersWithServices = _context.Offers
                .Include(o => o.Service)
                .Select(o => new
                {
                    o.OfferId,
                    //o.Description,
                    Description = o.Service.Description,
                    o.Rating,
                    o.ReviewCount,
                    o.DiscountPercentage,
                    o.IsActive,
                    ServiceId = o.Service.ServiceId,
                    pricePerNight = o.Service.Price,
                    ServiceName = o.Service.ServiceName,
                    ServiceImage = o.Service.Image
                })
                .ToList();

            return Ok(new { values = offersWithServices });
        }

        /// <summary>
        /// //////////////
        /// </summary>
        /// <param name="offerDto"></param>
        /// <returns></returns>

        [HttpPost("AddOfferByServiceName")]
        public async Task<IActionResult> AddOfferByServiceName([FromBody] OfferDTO offerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the service by ServiceName
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.ServiceName == offerDto.ServiceName);

            if (service == null)
            {
                return NotFound($"Service with name {offerDto.ServiceName} not found.");
            }

            // Map the DTO to the Offer entity
            var newOffer = new Offer
            {
                ServiceId = service.ServiceId,
                Description = offerDto.Description,
                PricePerNight = offerDto.PricePerTour, // Mapping PricePerTour to PricePerNight
                DiscountPercentage = offerDto.DiscountPercentage,
                IsActive = offerDto.IsActive,
                StartDate = offerDto.StartDate.ToString("yyyy-MM-dd"), // Formatting to string if needed
                EndDate = offerDto.EndDate.ToString("yyyy-MM-dd"),
                ImageUrl = offerDto.ImageUrl
            };

            // Add the new offer to the database
            _context.Offers.Add(newOffer);
            await _context.SaveChangesAsync();

            // Return success response
            return Ok(new
            {
                OfferId = newOffer.OfferId,
                Description = newOffer.Description,
                ServiceName = service.ServiceName, // Returning ServiceName
                PricePerNight = newOffer.PricePerNight,
                DiscountPercentage = newOffer.DiscountPercentage,
                IsActive = newOffer.IsActive,
                StartDate = newOffer.StartDate,
                EndDate = newOffer.EndDate,
                ImageUrl = newOffer.ImageUrl
            });
        }

    }
}



