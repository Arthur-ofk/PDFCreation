using DAL.Models;

using System;
using System.Collections.Generic;
using System.Text;

namespace DAL
{
    public interface ITemplateRepository
    {
        Task<Template> CreateTemplateAsync(Template template);
        Task<Template?> GetTemplateByIdAsync(Guid id);
        Task<List<Template>> GetAllTemplatesAsync();
        Task<Template?> GetByNameAsync(string name);
        Task<bool> UpdateTemplateAsync(Guid id, Template template);
        Task<bool> DeleteTemplateByIdAsync( Guid Id);

    }
}
