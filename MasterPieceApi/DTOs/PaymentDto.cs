namespace MasterPieceApi.DTOs
{
    public class PaymentDto
    {
        public int UserId { get; set; }            // The ID of the user making the payment
        public decimal Amount { get; set; }        // The amount of the payment
        public string PaymentStatus { get; set; }  // The status of the payment (e.g., "completed", "pending")
        public string PaymentMethod { get; set; }  // The method of payment (e.g., "PayPal", "Credit Card")
        public int ServiceId { get; set; }
    }
}
