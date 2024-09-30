using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int? UserId { get; set; }

    public decimal Amount { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? PaymentStatus { get; set; }

    public string? PaymentMethod { get; set; }

    public int? ServiceId { get; set; }

    public virtual Service? Service { get; set; }

    public virtual User? User { get; set; }
}
