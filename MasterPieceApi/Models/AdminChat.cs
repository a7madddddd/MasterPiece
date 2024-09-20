using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class AdminChat
{
    public int ChatId { get; set; }

    public int? UserId { get; set; }

    public int? AdminId { get; set; }

    public string Message { get; set; } = null!;

    public virtual User? User { get; set; }
}
