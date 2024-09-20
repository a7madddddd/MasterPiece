using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class ServiceDetail
{
    public int DetailId { get; set; }

    public int? ServiceId { get; set; }

    public int? UserId { get; set; }

    public string? Review { get; set; }

    public decimal? Rating { get; set; }

    public DateTime? ReviewDate { get; set; }

    public virtual Service? Service { get; set; }
}
