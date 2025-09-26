using System.Text.Json;
using BLL.Abstractions;

namespace BLL
{
    public class TemplateEngine : ITemplateEngine
    {
        public string Render(string template, object data)
        {
           
            var json = JsonSerializer.Serialize(data);
            return template.Replace("{{data}}", json);
        }
    }
}
