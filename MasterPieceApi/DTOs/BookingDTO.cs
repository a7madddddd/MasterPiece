﻿namespace MasterPieceApi.DTOs
{
    public class BookingDto
    {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public int ServiceId { get; set; }
        public DateTime BookingDate { get; set; }
        public int NumberOfPeople { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? ServiceName { get; set; } = null!;
        public string? Image { get; set; }

        public string PaymentStatus { get; set; }
    }
}
