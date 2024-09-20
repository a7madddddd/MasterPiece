using System;
using System.Collections.Generic;

namespace MasterPieceApi.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? ProfileImage { get; set; }

    public string? LastName { get; set; }

    public string? Phone { get; set; }

    public string UserRole { get; set; } = null!;

    public int? Password { get; set; }

    public virtual ICollection<AdminChat> AdminChats { get; set; } = new List<AdminChat>();

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<ContactMessage> ContactMessages { get; set; } = new List<ContactMessage>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Profile? Profile { get; set; }

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
