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



        // DELETE: api/Offers
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
                    Description = o.Service.Description,
                    o.Rating,
                    o.ReviewCount,
                    o.DiscountPercentage,
                    o.IsActive,
                    ServiceId = o.Service.ServiceId,
                    pricePerNight = o.Service.Price,
                    ServiceName = o.Service.ServiceName,
                    ServiceImage = o.Service.Image,
                    o.StartDate,
                    o.EndDate,
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
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { Errors = errors });
            }



            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.ServiceName == offerDto.ServiceName);

            if (service == null)
            {
                return NotFound($"Service with name {offerDto.ServiceName} not found.");
            }

            var newOffer = new Offer
            {
                ServiceId = service.ServiceId,
                DiscountPercentage = offerDto.DiscountPercentage,
                IsActive = offerDto.IsActive,
                StartDate = offerDto.StartDate.ToString("yyyy-MM-dd"), 
                EndDate = offerDto.EndDate.ToString("yyyy-MM-dd"),
            };

            _context.Offers.Add(newOffer);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                OfferId = newOffer.OfferId,
                ServiceName = service.ServiceName,
                DiscountPercentage = newOffer.DiscountPercentage,
                IsActive = newOffer.IsActive,
                StartDate = newOffer.StartDate,
                EndDate = newOffer.EndDate,
            });
        }


        [HttpDelete("DeleteOfferByServiceName")]
        public async Task<IActionResult> DeleteOfferByServiceName(string serviceName)
        {
            if (string.IsNullOrEmpty(serviceName))
            {
                return BadRequest("Service name cannot be empty.");
            }

            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.ServiceName == serviceName);

            if (service == null)
            {
                return NotFound($"Service with name '{serviceName}' not found.");
            }

            var offer = await _context.Offers
                .FirstOrDefaultAsync(o => o.ServiceId == service.ServiceId);

            if (offer == null)
            {
                return NotFound($"Offer for service '{serviceName}' not found.");
            }

            _context.Offers.Remove(offer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Offer deleted successfully" });
        }






        [HttpGet("GetOffersbyservicename")]
        public async Task<IActionResult> GetOffersbyservicename()
        {
            try
            {
                var offers = await _context.Offers
                    .Include(o => o.Service) 
                    .Select(o => new OfferDTO
                    {
                        OfferId = o.OfferId,
                        ServiceName = o.Service.ServiceName, 
                        DiscountPercentage = o.DiscountPercentage ?? 0,
                        StartDate = DateTime.Parse(o.StartDate),  
                        EndDate = DateTime.Parse(o.EndDate),     
                        IsActive = o.IsActive ?? false           
                    })
                    .ToListAsync();

                return Ok(offers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the offers", Details = ex.Message });
            }
        }







        [HttpPut("UpdateOfferByServiceName")]
        public async Task<IActionResult> UpdateOfferByServiceName([FromBody] OfferDTO offerDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { Errors = errors });
            }

            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.ServiceName == offerDto.ServiceName);

            if (service == null)
            {
                return NotFound($"Service with name {offerDto.ServiceName} not found.");
            }

            var existingOffer = await _context.Offers
                .FirstOrDefaultAsync(o => o.ServiceId == service.ServiceId);

            if (existingOffer == null)
            {
                return NotFound($"Offer for service {offerDto.ServiceName} not found.");
            }

            existingOffer.DiscountPercentage = offerDto.DiscountPercentage;
            existingOffer.IsActive = offerDto.IsActive;
            existingOffer.StartDate = offerDto.StartDate.ToString("yyyy-MM-dd"); // Format if needed
            existingOffer.EndDate = offerDto.EndDate.ToString("yyyy-MM-dd");

            await _context.SaveChangesAsync();

            return Ok(new
            {
                OfferId = existingOffer.OfferId,
                ServiceName = service.ServiceName,
                DiscountPercentage = existingOffer.DiscountPercentage,
                IsActive = existingOffer.IsActive,
                StartDate = existingOffer.StartDate,
                EndDate = existingOffer.EndDate
            });
        }




        [HttpPost("AddReview")]
        public async Task<ActionResult<ReviewResponseDto>> AddReview([FromBody] ReviewRequestDto request)
        {
            try
            {
                if (request.Rating < 1 || request.Rating > 5)
                {
                    return BadRequest(new ReviewResponseDto
                    {
                        Success = false,
                        Message = "Rating must be between 1 and 5"
                    });
                }

                var offer = await _context.Offers.FindAsync(request.OfferId);
                if (offer == null)
                {
                    return NotFound(new ReviewResponseDto
                    {
                        Success = false,
                        Message = "Offer not found"
                    });
                }

                decimal currentTotalRating = (offer.Rating ?? 0) * (offer.ReviewCount ?? 0);
                int newReviewCount = (offer.ReviewCount ?? 0) + 1;
                decimal newRating = (currentTotalRating + request.Rating) / newReviewCount;

                offer.Rating = Math.Round(newRating, 1); 
                offer.ReviewCount = newReviewCount;

                await _context.SaveChangesAsync();

                return Ok(new ReviewResponseDto
                {
                    Success = true,
                    Message = "Review added successfully",
                    NewRating = offer.Rating.Value,
                    NewReviewCount = offer.ReviewCount.Value
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ReviewResponseDto
                {
                    Success = false,
                    Message = "An error occurred while processing your review"
                });
            }
        }
    }

}




