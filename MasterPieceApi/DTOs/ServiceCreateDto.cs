namespace MasterPieceApi.DTOs
{
    public class ServiceCreateDto
    {
        public string ServiceName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? Description2 { get; set; }
        public string? Question { get; set; }
        public bool? IsActive { get; set; }
        public DateOnly? Dates { get; set; }

    }
}
