using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int UserId { get; set; }

    public int? ServiceId { get; set; }

    public DateOnly? BookingDate { get; set; }

    public int? NumberOfPeople { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? PaymentId { get; set; }

    public virtual Payment? Payment { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Service? Service { get; set; }

    public virtual User? User { get; set; }
}
