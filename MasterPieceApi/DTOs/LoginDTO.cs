namespace MasterPieceApi.DTOs
{
    public class LoginDTO
    {
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? UserRole { get; set; } = null!;
    }
}
