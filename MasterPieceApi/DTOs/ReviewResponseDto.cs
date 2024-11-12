namespace MasterPieceApi.DTOs
{
    public class ReviewResponseDto
    {

        public bool Success { get; set; }
        public string Message { get; set; }
        public decimal NewRating { get; set; }
        public int NewReviewCount { get; set; }
    }
}
