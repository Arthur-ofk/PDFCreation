
using BLL.Models.Contracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Abstractions
{
    public interface ITemplateService
    {
        Task<List<TemplateDto>> ListAsync();
        Task<TemplateDto?> GetAsync(Guid id);
        Task<TemplateDto?> GetByNameAsync(string name);
        Task<TemplateDto> CreateAsync( TemplateDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateTemplateDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<byte[]> RenderPdfAsync(Guid id, object data);
    }
}
