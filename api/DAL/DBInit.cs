namespace Sub_App_1.DAL;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Sub_App_1.Models;

public static class DBInit
{
    public static async Task SeedAsync(IApplicationBuilder app)
    {
        try
        {
            using var serviceScope = app.ApplicationServices.CreateScope();
            var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

            context.Database.EnsureCreated();

            // Seed roles and admin user
            await EnsureRolesExistAsync(roleManager);
            await EnsureAdminUserExistsAsync(userManager);

            
            /*if (!context.Products.Any())
            {
                var products = new List<Product>
                {
                    new Product { Name = "Apple", Category = "Fruit", Calories = 52 },
                    new Product { Name = "Banana", Category = "Fruit", Calories = 96 },
                    // Add more products as needed
                };

                context.Products.AddRange(products);
                context.SaveChanges();
            }*/
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred during seeding: {ex.Message}");
            throw;
        }
    }

    private static async Task EnsureRolesExistAsync(RoleManager<IdentityRole> roleManager)
    {
        var roles = new[] { UserRoles.RegularUser, UserRoles.FoodProducer, UserRoles.Administrator };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private static async Task EnsureAdminUserExistsAsync(UserManager<IdentityUser> userManager)
    {
        var adminUsername = "Admin";
        var adminUser = await userManager.FindByNameAsync(adminUsername);

        if (adminUser == null)
        {
            adminUser = new IdentityUser
            {
                UserName = adminUsername,
            };

            var result = await userManager.CreateAsync(adminUser, "OsloMet2024");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, UserRoles.Administrator);
            }
            else
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Failed to create admin user. Errors: {errors}");
            }
        }
        else
        {
            // Ensure the existing admin user has the Administrator role
            if (!await userManager.IsInRoleAsync(adminUser, UserRoles.Administrator))
            {
                await userManager.AddToRoleAsync(adminUser, UserRoles.Administrator);
            }
        }
    }
}
