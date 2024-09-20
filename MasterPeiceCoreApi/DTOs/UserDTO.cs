namespace MasterPeiceCoreApi.DTOs
{
    public class UserDTO
    {
        public int UserId { get; set; }

        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string UserRole { get; set; } = null!;

        public bool? IsActive { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? LastLogin { get; set; }

        public string PasswordHash { get; set; } = null!;

        public string? ProfileImage { get; set; } // New property to store image paths or URLs
    }

}
