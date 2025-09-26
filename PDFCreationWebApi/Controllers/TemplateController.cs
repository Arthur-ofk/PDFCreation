using AutoMapper;
using BLL;
using BLL.Abstractions;
using Microsoft.AspNetCore.Mvc;
using BLL.Models.Contracts;

namespace PDFCreationWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplateController : ControllerBase
    {
        private readonly ITemplateService templateService;
        public TemplateController(ITemplateService templateService)
        {
            this.templateService = templateService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TemplateDto>>> GetAll()
            => Ok(await templateService.ListAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateDto?>> Get(Guid id)
        {
            var result = await templateService.GetAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpGet("by-name/{name}")]
        public async Task<ActionResult<TemplateDto?>> GetByName(string name)
        {
            var result = await templateService.GetByNameAsync(name);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<TemplateDto>> Create(TemplateDto dto)
            => Ok(await templateService.CreateAsync(dto));

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, UpdateTemplateDto dto)
            => await templateService.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
            => await templateService.DeleteAsync(id) ? NoContent() : NotFound();

        [HttpPost("{id}/render-pdf")]
        public async Task<ActionResult> RenderPdf(Guid id, [FromBody] object data)
        {
            var pdf = await templateService.RenderPdfAsync(id, data);
            return File(pdf, "application/pdf");
        }
    }
}
