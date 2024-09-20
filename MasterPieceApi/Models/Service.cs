using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class Service
{
    public int ServiceId { get; set; }

    public string ServiceName { get; set; } = null!;

    public string? Description { get; set; }

    public string? Image { get; set; }

    public decimal? Price { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateOnly? Dates { get; set; }

    public bool? Most { get; set; }

    public string? Question { get; set; }

    public string? Link { get; set; }

    public string? Description2 { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<ServiceDetail> ServiceDetails { get; set; } = new List<ServiceDetail>();

    public virtual ICollection<ServicesGallery> ServicesGalleries { get; set; } = new List<ServicesGallery>();
}
