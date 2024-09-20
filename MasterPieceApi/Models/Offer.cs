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
}
