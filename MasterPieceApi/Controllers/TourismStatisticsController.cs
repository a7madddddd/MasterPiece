using MasterPieceApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MasterPieceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourismStatisticsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public TourismStatisticsController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/TourismStatistics
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourismStatistic>>> GetTourismStatistics()
        {
            return await _context.TourismStatistics.ToListAsync();
        }

        // GET: api/TourismStatistics
        [HttpGet("{id}")]
        public async Task<ActionResult<TourismStatistic>> GetTourismStatistic(int id)
        {
            var tourismStatistic = await _context.TourismStatistics.FindAsync(id);

            if (tourismStatistic == null)
            {
                return NotFound();
            }

            return tourismStatistic;
        }

        // PUT: api/TourismStatistics
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTourismStatistic(int id, TourismStatistic tourismStatistic)
        {
            if (id != tourismStatistic.Year)
            {
                return BadRequest();
            }

            _context.Entry(tourismStatistic).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourismStatisticExists(id))
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

        // POST: api/TourismStatistics
        [HttpPost]
        public async Task<ActionResult<TourismStatistic>> PostTourismStatistic(TourismStatistic tourismStatistic)
        {
            _context.TourismStatistics.Add(tourismStatistic);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TourismStatisticExists(tourismStatistic.Year))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTourismStatistic", new { id = tourismStatistic.Year }, tourismStatistic);
        }

        // DELETE: api/TourismStatistics
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTourismStatistic(int id)
        {
            var tourismStatistic = await _context.TourismStatistics.FindAsync(id);
            if (tourismStatistic == null)
            {
                return NotFound();
            }

            _context.TourismStatistics.Remove(tourismStatistic);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TourismStatisticExists(int id)
        {
            return _context.TourismStatistics.Any(e => e.Year == id);
        }
    }
}
