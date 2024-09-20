namespace MasterPieceApi.DTOs
{
    public class ServiceDetailsDTO
    {
        public int ServiceID { get; set; }        // ID of the service
        public string ServiceName { get; set; }   // Name of the service (e.g., Ajloun Castle Tour)
        public string Description { get; set; }   // Description of the service (what the user sees)
        public string ImageUrl { get; set; }      // URL or path to the image for the service
        public decimal Price { get; set; }        // Price of the service
        public bool IsActive { get; set; }        // Indicates if the service is active
        
        public string Dates { get; set; }         // Available days (e.g., Friday - Saturday)
        
        public string CommonQuestion { get; set; } // Frequently asked question related to the service
        public string BookingLink { get; set; }   // Link for booking or exploring more about the service
    }
}
