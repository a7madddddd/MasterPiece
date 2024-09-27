namespace MasterPieceApi.DTOs
{
    public class UsersBookings
    {
        public int BookingId { get; set; }
        public DateTime BookingDate { get; set; }
        public int? NumberOfPeople { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Status { get; set; }
        public string Username { get; set; } = null!;
        public string ServiceName { get; set; } = null!;
    }
}
