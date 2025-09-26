using BLL.Abstractions;
using HandlebarsDotNet;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Dynamic;
using System.Text.Json;

namespace BLL
{
    public class TemplateEngine : ITemplateEngine
    {
        public string Render(string template, object data)
        {
            if (string.IsNullOrEmpty(template))
                return string.Empty;
            
            object model = JsonConvert.DeserializeObject<ExpandoObject>(((JsonElement)data).TryGetProperty("data",out var inner)? inner.GetRawText() : ((JsonElement)data).GetRawText(), new ExpandoObjectConverter());
            var handlebars = Handlebars.Create();
            handlebars.Configuration.ThrowOnUnresolvedBindingExpression = true;
            var compiledTemplate = handlebars.Compile(template);
            return compiledTemplate(model);
        }
    }
}
