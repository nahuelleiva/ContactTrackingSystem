using AutoMapper;
using ContactTrackingSystem.DTO;
using ContactTrackingSystem.Models;

namespace ContactTrackingSystem.AutoMapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            InitializeMappings();
        }

        public void InitializeMappings()
        {
            CreateMap<Contact, ContactDTO>();
            CreateMap<ContactDTO, Contact>();
            CreateMap<PaginatedResult, PaginatedResultDTO>();
        }
    }
}
