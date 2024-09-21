using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class JoinRequest
{
    public int RequestId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Message { get; set; }

    public string? ServiceImage { get; set; }

    public string? Status { get; set; }
}
