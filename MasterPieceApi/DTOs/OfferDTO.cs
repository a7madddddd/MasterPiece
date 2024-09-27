namespace MasterPieceApi.DTOs
{
    public class OfferDTO
    {
        public int? ServiceId { get; set; }
        public string Description { get; set; } // Add description for offers
        public string ServiceName { get; set; }  // From the Service table
        public string ImageUrl { get; set; }     // From the Service table
        public decimal PricePerTour { get; set; }
        public decimal DiscountPercentage { get; set; }
        public bool IsActive { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }


}

