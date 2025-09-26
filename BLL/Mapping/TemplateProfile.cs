using AutoMapper;
using DAL.Models;
using BLL.Models.Contracts;

namespace BLL.Mapping
{
    public class TemplateProfile : Profile
    {
        public TemplateProfile()
        {
           
            CreateMap<Template, TemplateDto>()
                .ForMember(dest => dest.JsonSchema, opt => opt.MapFrom(src => src.jsonschema));
            CreateMap<TemplateDto, Template>()
                .ForMember(dest => dest.jsonschema, opt => opt.MapFrom(src => src.JsonSchema));
        }
    }
}
