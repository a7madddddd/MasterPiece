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
        [HttpPost("paymentByUserId/{userId}")]
        public async Task<IActionResult> CreatePayment(int userId, [FromBody] PaymentDto paymentDto)
        {
            if (paymentDto == null || userId <= 0)
            {
                return BadRequest("Invalid payment data.");
            }

            var payment = new Payment
            {
                UserId = userId,
                Amount = paymentDto.Amount,
                PaymentDate = DateTime.Now,
                PaymentStatus = paymentDto.PaymentStatus,
                PaymentMethod = paymentDto.PaymentMethod,
                ServiceId = paymentDto.ServiceId
            };

            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreatePayment), new { id = payment.PaymentId }, payment);
        }

        [HttpGet("userPayment/{id}")]
        public IActionResult getUserPayment(int id)
        {
            // Fetch payments from the database using the provided user ID
            var payments = _context.Payments
                .Where(p => p.UserId == id)
                .ToList();

            if (payments == null || payments.Count == 0)
            {
                return NotFound(new { message = "No payments found for this user." });
            }

            return Ok(payments);
        }

    }
}

