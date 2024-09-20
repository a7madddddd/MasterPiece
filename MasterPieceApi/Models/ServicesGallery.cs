using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class ServicesGallery
{
    public int GalleryId { get; set; }

    public int? ServiceId { get; set; }

    public string? Image1 { get; set; }

    public string? Image2 { get; set; }

    public string? Image3 { get; set; }

    public string? Image4 { get; set; }

    public string? Image5 { get; set; }

    public string? Image6 { get; set; }

    public virtual Service? Service { get; set; }
}
