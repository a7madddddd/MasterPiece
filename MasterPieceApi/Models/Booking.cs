using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MasterPieceApi.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int UserId { get; set; }

    public int ServiceId { get; set; }

    public DateOnly? BookingDate { get; set; }

    public int NumberOfPeople { get; set; }

    public decimal TotalAmount { get; set; }

    public string? Status { get; set; }

    public DateTime CreatedAt { get; set; }
     [JsonIgnore]
    public virtual Service? Service { get; set; }
    [JsonIgnore]
    public virtual User? User { get; set; }
}
