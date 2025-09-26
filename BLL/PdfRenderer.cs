using BLL.Abstractions;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class PdfRenderer : IPdfRenderer
    {
        public Task<byte[]> RenderPdfAsync(string htmlContent)
        {
            return Task.FromResult(Encoding.UTF8.GetBytes(htmlContent));
        }
    }
}
