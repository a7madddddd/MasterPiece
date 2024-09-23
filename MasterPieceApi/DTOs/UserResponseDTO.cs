namespace MasterPieceApi.DTOs
{
    public class UserResponseDTO
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Password { get; set; }
        public string? Phone { get; set; }
        public string? ProfileImage { get; set; }
    }
}
