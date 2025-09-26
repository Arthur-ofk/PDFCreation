using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Abstractions
{
    public interface ITemplateEngine
    {
        string Render(string template, object data);
    }
}
