using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class Profile
{
    public int ProfileId { get; set; }

    public int? UserId { get; set; }

    public string? Location { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? ProfilePicture { get; set; }

    public virtual User? User { get; set; }
}
