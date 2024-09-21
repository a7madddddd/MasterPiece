using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class Offer
{
    public int OfferId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public decimal? DiscountPercentage { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public decimal PricePerNight { get; set; }

    public decimal? Rating { get; set; }

    public int? ReviewCount { get; set; }

    public string? AccommodationType { get; set; }

    public string? ImageUrl { get; set; }

    public string? Amenities { get; set; }
}
