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


// Configures and runs the application.
var builder = WebApplication.CreateBuilder(args);



// Configure Serilog logging
// Sets up Serilog for logging, including configuration from appsettings.json and output to the console.
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


// Adds essential services to the container, including controllers, JSON options, Swagger, and Identity services.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; // Pretty JSON
    });




// Configures Swagger for API documentation.
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


// Adds the application database context using SQLite as the database provider.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));


// Configures ASP.NET Core Identity with custom password requirements.
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


// Configures JWT authentication with token validation parameters.
// Ensures secure authentication by validating the issuer, audience, lifetime, and signing key of JWT tokens.

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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"] ?? string.Empty))
        };
    });

/*
Configures the behavior of the application cookie for authentication.
Ensures that unauthorized and forbidden requests return appropriate HTTP status codes
instead of redirecting to login or access denied pages.

This configuration is essential for API-only applications like this where redirecting to login
or access denied pages is not suitable, and the client (e.g., React frontend) expects
proper HTTP status codes (401 for unauthorized and 403 for forbidden).
*/
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


// Registers the repository interfaces with their implementations.
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();


// Configures CORS policies to allow specific origins for the React frontend.
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactCorsPolicy", policy =>
    {
        policy.WithOrigins((builder.Configuration["CORS:AllowedOrigins"] ?? "").Split(','))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();


// Ensures database creation and seeds initial data.
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    await DBInit.SeedAsync(app);
}


// Configures middleware for development and production environments.
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


// Configures middleware for routing, CORS, authentication, and authorization.
app.UseRouting();
app.UseCors("ReactCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();


// Maps controller routes.
app.MapControllers();


// Ensures Serilog flushes logs on application stop.
app.Lifetime.ApplicationStopped.Register(Log.CloseAndFlush);


// Runs the application.
app.Run();
