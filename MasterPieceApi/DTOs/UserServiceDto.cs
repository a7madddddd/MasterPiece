namespace MasterPieceApi.DTOs
{
    public class UserServiceDto
    {
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = null!;
        public decimal? Price { get; set; }
        
    }
}

