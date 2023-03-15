using ContactTrackingSystem.Models;

namespace ContactTrackingSystem.Contracts
{
    public interface ILogicManager
    {
        Task<PaginatedResult> GetContactsList(int pageSize, int pageNumber);
        Task CreateContact(Contact newContact);
        Task<List<Contact>> SearchContacts(string firstName, string lastName, string emailAddress, string phoneNumber, string zipCode);
    }
}
