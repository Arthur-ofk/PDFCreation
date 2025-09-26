using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Abstractions
{
    public interface IPdfRenderer
    {
        Task<byte[]> RenderPdfAsync(string htmlContent);    
    }
}
