using BLL.Abstractions;
using PuppeteerSharp;
using System.Threading.Tasks;

namespace BLL
{
    public class PdfRenderer : IPdfRenderer
    {
        public async Task<byte[]> RenderPdfAsync(string htmlContent)
        {
            var execPath = Environment.GetEnvironmentVariable("PUPPETEER_EXECUTABLE_PATH") ?? "/usr/bin/google-chrome";
            var argsEnv = Environment.GetEnvironmentVariable("PUPPETEER_ARGS") ?? "--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage";
            var args = argsEnv.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
            {
                Headless = true,
                ExecutablePath = execPath,
                Args = args
            });

            await using var page = await browser.NewPageAsync();
            await page.SetContentAsync(htmlContent, new NavigationOptions { WaitUntil = new[] { WaitUntilNavigation.Networkidle0 } });
            return await page.PdfDataAsync(new PdfOptions { PrintBackground = true });
        }
    }
}

