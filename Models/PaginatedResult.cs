namespace ContactTrackingSystem.Models
{
    public class PaginatedResult
    {
        public int TotalRecords { get; set; }
        public int TotalPages { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<Contact>? Contacts { get; set; }
    }
}
