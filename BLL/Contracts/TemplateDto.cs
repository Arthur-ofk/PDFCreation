using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Models.Contracts
{
     public record  TemplateDto( Guid Id,string Name , string Content, string? JsonSchema, DateTime CreatedAt,DateTime UpdatedAt);
    
}
