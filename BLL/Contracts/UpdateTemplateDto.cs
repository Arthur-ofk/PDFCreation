using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Models.Contracts
{
    public record UpdateTemplateDto(string Name, string Content, string? JsonSchema);
    
}
