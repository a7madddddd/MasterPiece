using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class TourismStatistic
{
    public int Year { get; set; }

    public int? Clients { get; set; }

    public decimal? ClientsChangePercentage { get; set; }

    public int? ReturningClients { get; set; }

    public decimal? ReturningClientsChangePercentage { get; set; }

    public int? Reservations { get; set; }

    public decimal? ReservationsChangePercentage { get; set; }

    public int? Items { get; set; }

    public decimal? ItemsChangePercentage { get; set; }

    public int? Awwards { get; set; }

    public string Days { get; set; } = null!;

    public string? Duration { get; set; }
}
