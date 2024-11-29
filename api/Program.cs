using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using api.DAL;
using api.DAL.Interfaces;
using api.DAL.Repositories;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Reflection;

/// <summary>
/// Configures and runs the application.
/// </summary>
var builder = WebApplication.CreateBuilder(args);

// Configure Serilog logging
/// <summary>
/// Sets up Serilog for logging, including configuration from appsettings.json and output to the console.
/// </summary>
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console());

/// <summary>
/// Adds essential services to the container, including controllers, JSON options, Swagger, and Identity services.
/// </summary>
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; // Pretty JSON
    });

/// <summary>
/// Configures Swagger for API documentation.
/// </summary>
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FoodBank (Sub-App-2) | API",
        Version = "v1"
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);

    // Support for annotations like [FromBody]
    c.SupportNonNullableReferenceTypes();
});

/// <summary>
/// Adds the application database context using SQLite as the database provider.
/// </summary>
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

/// <summary>
/// Configures ASP.NET Core Identity with custom password requirements.
/// </summary>
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

/// <summary>
/// Configures JWT authentication with token validation parameters.
/// </summary>
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
            ValidAudience = builder.Configuration["JWT:ValidAudience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
        };
    });

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});


/// <summary>
/// Registers the repository interfaces with their implementations.
/// </summary>
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

/// <summary>
/// Configures CORS policies to allow specific origins for the React frontend.
/// </summary>
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactCorsPolicy", policy =>
    {
        policy.WithOrigins(builder.Configuration["CORS:AllowedOrigins"].Split(','))
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

/// <summary>
/// Ensures database creation and seeds initial data.
/// </summary>
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    await DBInit.SeedAsync(app);
}

/// <summary>
/// Configures middleware for development and production environments.
/// </summary>
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "FoodBank (Sub-App-2) | API v1"));
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

/// <summary>
/// Configures middleware for routing, CORS, authentication, and authorization.
/// </summary>
app.UseRouting();
app.UseCors("ReactCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

/// <summary>
/// Maps controller routes.
/// </summary>
app.MapControllers();

/// <summary>
/// Ensures Serilog flushes logs on application stop.
/// </summary>
app.Lifetime.ApplicationStopped.Register(Log.CloseAndFlush);

/// <summary>
/// Runs the application.
/// </summary>
app.Run();
