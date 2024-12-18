﻿using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class ContactMessage
{
    public int MessageId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Subject { get; set; }

    public string Message { get; set; } = null!;

    public DateTime? SubmittedAt { get; set; }

    public string? Status { get; set; }

    public int? UserId { get; set; }

    public string? Replay { get; set; }

    public virtual User? User { get; set; }
}
