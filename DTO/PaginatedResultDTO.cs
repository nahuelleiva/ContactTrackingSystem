namespace ContactTrackingSystem.DTO
{
    public class PaginatedResultDTO
    {
        public int TotalRecords { get; set; }
        public int TotalPages { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<ContactDTO>? Contacts { get; set; }
    }
}
