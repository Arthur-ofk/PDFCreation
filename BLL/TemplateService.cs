using AutoMapper;
using BLL.Abstractions;
using BLL.Models.Contracts;
using DAL;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL
{
    public class TemplateService : ITemplateService
    {
        private readonly ITemplateRepository templateRepository;
        private readonly ITemplateEngine templateEngine;
        private readonly IPdfRenderer pdfRenderer;
        private readonly IMapper mapper;
        public TemplateService(ITemplateRepository templateRepository, ITemplateEngine templateEngine, IPdfRenderer pdfRenderer, IMapper mapper)
        {
            this.templateRepository = templateRepository;
            this.templateEngine = templateEngine;
            this.pdfRenderer = pdfRenderer;
            this.mapper = mapper;
        }

        public async Task<TemplateDto> CreateAsync(TemplateDto dto)
        { 
            
            var template = mapper.Map<Template>(dto);
            var created = await templateRepository.CreateTemplateAsync(template);
            return mapper.Map<TemplateDto>(created);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await templateRepository.DeleteTemplateByIdAsync(id);
        }

        public async Task<TemplateDto?> GetAsync(Guid id)
        {
            var template = await templateRepository.GetTemplateByIdAsync(id);
            return template == null ? null : mapper.Map<TemplateDto>(template);
        }

        public async Task<TemplateDto?> GetByNameAsync(string name)
        {
            var template = await templateRepository.GetByNameAsync(name);
            return template == null ? null : mapper.Map<TemplateDto>(template);
        }

        public async Task<List<TemplateDto>> ListAsync()
        {
            var templates = await templateRepository.GetAllTemplatesAsync();
            return mapper.Map<List<TemplateDto>>(templates);
        }

        public async Task<byte[]> RenderPdfAsync(Guid id, object data)
        {
            var template = await templateRepository.GetTemplateByIdAsync(id);
            if (template == null) throw new Exception("Template not found");
            var html = templateEngine.Render(template.Content, data);
            return await pdfRenderer.RenderPdfAsync(html);
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateTemplateDto dto)
        {
            var template = await templateRepository.GetTemplateByIdAsync(id);
            if (template == null) return false;
            template.Name = dto.Name;
            template.Content = dto.Content;
            template.jsonschema = dto.JsonSchema;
            template.UpdatedAt = DateTime.UtcNow;
            return await templateRepository.UpdateTemplateAsync(id, template);
        }
    }
}
