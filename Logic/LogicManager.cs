using ContactTrackingSystem.Contracts;
using ContactTrackingSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace ContactTrackingSystem.Logic
{
    public class LogicManager : ILogicManager
    {
        private readonly ILogger<LogicManager> _logger;
        private readonly ContactTrackingSystemDbContext _context;

        public LogicManager(ILogger<LogicManager> logger, ContactTrackingSystemDbContext context) { 
            _logger = logger;
            _context = context;
        }

        public async Task<List<Contact>> GetContactsList()
        {
            try
            {
                var contacts = await _context.Contacts.ToListAsync();

                return contacts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                _logger.LogError(ex.StackTrace);
                throw;
            }
        }

        public async Task CreateContact(Contact newContact)
        {
            try
            {
                var existingContact = await _context.Contacts.FirstOrDefaultAsync(x => x.EmailAddress.Equals(newContact.EmailAddress));
                if (existingContact != null)
                {
                    return;
                }

                await _context.Contacts.AddAsync(newContact);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                _logger.LogError(ex.StackTrace);
                throw;
            }
        }

        public async Task<List<Contact>> SearchContacts(string? firstName, string? lastName, string? emailAddress, string? phoneNumber, string? zipCode)
        {
            try
            {
                var contacts = await _context.Contacts.Where(x => (string.IsNullOrEmpty(firstName) || x.FirstName.Contains(firstName)) &&
                                                            (string.IsNullOrEmpty(lastName) || x.LastName.Contains(lastName)) &&
                                                            (string.IsNullOrEmpty(emailAddress) || x.EmailAddress.Contains(emailAddress)) &&
                                                            (string.IsNullOrEmpty(phoneNumber) || x.PhoneNumber.Contains(phoneNumber)) &&
                                                            (string.IsNullOrEmpty(zipCode) || x.ResidentialZipCode.Contains(zipCode)))
                                                .ToListAsync();

                return contacts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                _logger.LogError(ex.StackTrace);
                throw;
            }
        }
    }
}
