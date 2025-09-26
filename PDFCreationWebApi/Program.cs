using BLL;
using BLL.Abstractions;
using DAL;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BLL.Mapping;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddDbContext<DataBaseContext>(o=>
o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddScoped<ITemplateRepository, TemplateRepository>();
builder.Services.AddScoped<ITemplateService, TemplateService>();
builder.Services.AddScoped<ITemplateEngine, TemplateEngine>();
builder.Services.AddScoped<IPdfRenderer, PdfRenderer>();
builder.Services.AddAutoMapper(cfg => { }, typeof(TemplateProfile));

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DataBaseContext>();
    db.Database.EnsureCreated();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
