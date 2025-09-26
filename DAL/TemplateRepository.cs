using DAL.Models;

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL
{
    public class TemplateRepository : ITemplateRepository
    {
        
        private readonly DataBaseContext _context;

        public TemplateRepository(DataBaseContext context)
        {
            _context = context;
        }
        
        public async Task<Template> CreateTemplateAsync(Template template)
        {
            template.Id = Guid.NewGuid();
            _context.Templates.Add(template);
            await _context.SaveChangesAsync();
            return template;
        }

        public async Task<bool> DeleteTemplateByIdAsync(Guid Id)
        {
            var templatetoDelete = await _context.Templates.FindAsync(Id);
            if (templatetoDelete == null)
            {
                return false;
            }
            _context.Templates.Remove(templatetoDelete);
            await _context.SaveChangesAsync();
            return true;
        }

      

        public async Task<Template?> GetTemplateByIdAsync(Guid id)
        {
            var template = await _context.Templates.Where(x=>x.Id ==id).FirstOrDefaultAsync();
            return template;
           
        }

        public async Task<List<Template>> GetAllTemplatesAsync()

        {
            var templates = await _context.Templates.OrderByDescending(t => t.Name).ToListAsync();
            return templates;
        }

        public async Task<bool> UpdateTemplateAsync(Guid id, Template template)
        {
            _context.Templates.Update(template);
            var r= await _context.SaveChangesAsync();
            return r>0;

        }

      
       

        Task<Template?> ITemplateRepository.GetByNameAsync(string name)
        {
            var template =  _context.Templates.Where(x => x.Name == name).FirstOrDefaultAsync();
            return template;
        }

       
    }
}
