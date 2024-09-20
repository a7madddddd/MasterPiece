public class UserDTO
{
    public int? UserId { get; set; } // Matches UserID in the database

    public string Username { get; set; } = null!; // Matches Username in the database

    public string Email { get; set; } = null!; // Matches Email in the database

    // Password should be only used for user input and not stored
    public string Password { get; set; }

    public string? FirstName { get; set; } // Matches FirstName in the database

    public string? LastName { get; set; } // Matches LastName in the database

    public string UserRole { get; set; } = null!; // Matches UserRole in the database

    // These are optional fields based on your logic or UI requirements
    // Remove or keep based on whether they are needed
    public string PasswordHash { get; set; } = null!; // Matches PasswordHash in the database

    public string? ProfileImage { get; set; } // Matches ProfileImage in the database

    // Remove properties that don't exist in the database
    // public bool? IsActive { get; set; } 
    // public DateTime? CreatedAt { get; set; } 
    // public DateTime? LastLogin { get; set; } 
}
