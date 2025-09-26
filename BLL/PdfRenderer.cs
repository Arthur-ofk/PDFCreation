using BLL.Abstractions;
using PuppeteerSharp;
using System.Threading.Tasks;

namespace BLL
{
    public class PdfRenderer : IPdfRenderer
    {
        public async Task<byte[]> RenderPdfAsync(string htmlContent)
        {
            using var browserFetcher = new BrowserFetcher();
            await browserFetcher.DownloadAsync();
            
            await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions { Headless = true });
            await using var page = await browser.NewPageAsync();
            
            await page.SetContentAsync(htmlContent);
            return await page.PdfDataAsync();
        }
    }
}
