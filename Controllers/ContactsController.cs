using AutoMapper;
using ContactTrackingSystem.Contracts;
using ContactTrackingSystem.DTO;
using ContactTrackingSystem.Models;
using Microsoft.AspNetCore.Mvc;

namespace ContactTrackingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly ILogger<ContactsController> _logger;
        private readonly ILogicManager _logicManager;
        private readonly IMapper _mapper;
        public ContactsController(ILogger<ContactsController> logger, ILogicManager logicManager, IMapper mapper)
        {
            _logger = logger;
            _logicManager = logicManager;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("get-contacts")]
        public async Task<IActionResult> GetContactsList()
        {
            var contacts = await _logicManager.GetContactsList();
            var mappedContacts = _mapper.Map<List<Contact>, List<ContactDTO>>(contacts);

            return Ok(mappedContacts);
        }

        [HttpGet]
        [Route("search-contacts")]
        public async Task<IActionResult> SearchContacts(
            [FromQuery] string? firstName, [FromQuery] string? lastName, 
            [FromQuery] string? emailAddress, [FromQuery] string? phoneNumber, 
            [FromQuery] string? zipCode)
        {
            var foundContacts = await _logicManager.SearchContacts(firstName, lastName, emailAddress, phoneNumber, zipCode);
            var mappedContacts = _mapper.Map<List<Contact>, List<ContactDTO>>(foundContacts);

            return Ok(mappedContacts);
        }

        [HttpPost]
        [Route("create-contact")]
        public async Task<IActionResult> CreateContact(ContactDTO newContact)
        {
            var mappedContact = _mapper.Map<ContactDTO, Contact>(newContact);
            await _logicManager.CreateContact(mappedContact);

            return Ok();
        }
    }
}
