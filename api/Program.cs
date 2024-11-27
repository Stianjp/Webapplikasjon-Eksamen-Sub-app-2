using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using api.DAL;
using api.DAL.Interfaces;
using api.DAL.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Use Serilog for logging
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File($"APILogs/app_{DateTime.Now:yyyyMMdd_HHmmss}.log")
    .Filter.ByExcluding(e => e.Properties.TryGetValue("SourceContext", out var value) &&
                            e.Level == LogEventLevel.Information &&
                            e.MessageTemplate.Text.Contains("Executed DbCommand"))
    .CreateLogger();

builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console());

// Add services to the container
builder.Services.AddControllers()
    .AddNewtonsoftJson(options => {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add ApplicationDbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ApplicationDbContextConnection") + ";Cache=Shared"),
    ServiceLifetime.Scoped);

// Register Identity services
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 1;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Register repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddControllers();

// Add CORS policy for API
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.AllowAnyOrigin()
                         .AllowAnyMethod()
                         .AllowAnyHeader());
});

// Configure Kestrel
builder.WebHost.ConfigureKestrel((context, options) =>
{
    options.Configure(context.Configuration.GetSection("Kestrel"));
});

var app = builder.Build();



// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    // Seed the database
    await DBInit.SeedAsync(app);
    app.UseSwagger(c =>
    {
        c.SerializeAsV2 = false;
    });
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
        // Set Swagger UI at the root
        c.RoutePrefix = "swagger";
    });
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

// API routes
app.MapControllerRoute(name: "api", pattern: "{controller}/{action=Index}/{id?}");

app.Lifetime.ApplicationStopped.Register(Log.CloseAndFlush);

app.Run();
