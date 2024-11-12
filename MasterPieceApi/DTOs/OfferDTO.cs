namespace MasterPieceApi.DTOs
{
    public class OfferDTO
    {
        public int OfferId { get; set; }

        public string ServiceName { get; set; } = null!;
        public decimal DiscountPercentage { get; set; }
        public bool IsActive { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }


}

