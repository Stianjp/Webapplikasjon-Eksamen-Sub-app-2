namespace api.DAL;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using api.Models;

/// <summary>
/// Provides database initialization and seeding logic, including roles, users, and sample products.
/// </summary>
public static class DBInit
{
    /// <summary>
    /// Seeds the database with roles, admin users, a default producer, and sample products.
    /// </summary>
    /// <param name="app">The application builder to create a service scope.</param>
    /// <returns>A task representing the asynchronous seeding operation.</returns>
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

            if (!context.Products.Any())
            {
                var defaultProducer = await EnsureDefaultProducerExistsAsync(userManager);

                var products = new List<Product>
                {
                    // Fresh Produce
                    new Product { Name = "Beef", Description = "Cut of beef meat", Category = "Fresh Produce", Calories = 250, Protein = 25, Carbohydrates = 0, Fat = 12, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Lamb Chop", Description = "Cut of lamb meat", Category = "Fresh Produce", Calories = 290, Protein = 23, Carbohydrates = 0, Fat = 15, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Pork Chop", Description = "Cut of pork meat", Category = "Fresh Produce", Calories = 270, Protein = 20, Carbohydrates = 0, Fat = 13, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Hamburger", Description = "Beef patty", Category = "Fresh Produce", Calories = 280, Protein = 18, Carbohydrates = 0, Fat = 17, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Chicken Fillet", Description = "Fresh chicken fillet", Category = "Fresh Produce", Calories = 110, Protein = 23, Carbohydrates = 0, Fat = 1.5, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Chicken Thighs", Description = "Fresh chicken thighs with skin", Category = "Fresh Produce", Calories = 190, Protein = 19, Carbohydrates = 0, Fat = 10, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Fish Cakes", Description = "Fresh fish cakes", Category = "Fresh Produce", Calories = 170, Protein = 12, Carbohydrates = 8, Fat = 7, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Fish Pudding", Description = "Fresh fish pudding made from white fish", Category = "Fresh Produce", Calories = 140, Protein = 10, Carbohydrates = 7, Fat = 5, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Meatballs", Description = "Fresh meatballs made from beef", Category = "Fresh Produce", Calories = 210, Protein = 12, Carbohydrates = 10, Fat = 15, Allergens = null, ProducerId = defaultProducer.Id},

                    // Frozen Goods
                    new Product { Name = "Frozen Cod Fillet", Description = "Frozen cod fish fillet", Category = "Frozen Goods", Calories = 85, Protein = 20, Carbohydrates = 0, Fat = 1, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Frozen Vegetable Mix", Description = "Frozen mix of vegetables", Category = "Frozen Goods", Calories = 50, Protein = 2, Carbohydrates = 8, Fat = 0.5, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Frozen Salmon", Description = "Frozen salmon fish fillet", Category = "Frozen Goods", Calories = 200, Protein = 20, Carbohydrates = 0, Fat = 13, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Frozen Berry Mix", Description = "Frozen mix of berries", Category = "Frozen Goods", Calories = 65, Protein = 1, Carbohydrates = 12, Fat = 0.2, Allergens = null, ProducerId = defaultProducer.Id},

                    // Fruits and Vegetables
                    new Product { Name = "Apple", Description = "Fresh apple", Category = "Fruits and Vegetables", Calories = 52, Protein = 0.3, Carbohydrates = 14, Fat = 0.2, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Broccoli", Description = "Fresh broccoli", Category = "Fruits and Vegetables", Calories = 55, Protein = 3, Carbohydrates = 7, Fat = 0.4, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Avocado", Description = "Fresh avocado", Category = "Fruits and Vegetables", Calories = 240, Protein = 2, Carbohydrates = 9, Fat = 15, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Potato", Description = "Fresh potato", Category = "Fruits and Vegetables", Calories = 80, Protein = 2, Carbohydrates = 17, Fat = 0.1, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Tomato", Description = "Fresh tomato", Category = "Fruits and Vegetables", Calories = 20, Protein = 1, Carbohydrates = 3, Fat = 0.2, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Carrot", Description = "Fresh carrot", Category = "Fruits and Vegetables", Calories = 35, Protein = 0.9, Carbohydrates = 7, Fat = 0.2, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Celery Stalk", Description = "Fresh celery stalk", Category = "Fruits and Vegetables", Calories = 15, Protein = 0.7, Carbohydrates = 3, Fat = 0.1, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Iceberg Lettuce", Description = "Fresh iceberg lettuce", Category = "Fruits and Vegetables", Calories = 14, Protein = 0.9, Carbohydrates = 2, Fat = 0.1, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Bell Pepper", Description = "Fresh bell pepper (red/green/yellow)", Category = "Fruits and Vegetables", Calories = 25, Protein = 1.2, Carbohydrates = 6, Fat = 0.2, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Cucumber", Description = "Fresh cucumber", Category = "Fruits and Vegetables", Calories = 12, Protein = 0.6, Carbohydrates = 2, Fat = 0.1, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Peas", Description = "Fresh peas", Category = "Fruits and Vegetables", Calories = 85, Protein = 5.5, Carbohydrates = 14, Fat = 0.4, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Corn", Description = "Fresh or canned corn", Category = "Fruits and Vegetables", Calories = 105, Protein = 3.2, Carbohydrates = 19, Fat = 1.2, Allergens = null, ProducerId = defaultProducer.Id},

                    // Dry Goods
                    new Product { Name = "Spaghetti", Description = "Dried spaghetti", Category = "Dry Goods", Calories = 370, Protein = 12, Carbohydrates = 75, Fat = 1.5, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Oats", Description = "Dried oats", Category = "Dry Goods", Calories = 390, Protein = 13, Carbohydrates = 60, Fat = 7, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Rice", Description = "Dried rice", Category = "Dry Goods", Calories = 360, Protein = 7, Carbohydrates = 80, Fat = 0.5, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Lentils", Description = "Dried lentils", Category = "Dry Goods", Calories = 310, Protein = 25, Carbohydrates = 50, Fat = 1, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Chickpeas", Description = "Dried chickpeas", Category = "Dry Goods", Calories = 380, Protein = 19, Carbohydrates = 61, Fat = 6, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Macaroni", Description = "Dried macaroni", Category = "Dry Goods", Calories = 360, Protein = 12, Carbohydrates = 74, Fat = 1.5, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Penne", Description = "Dried penne pasta", Category = "Dry Goods", Calories = 360, Protein = 12, Carbohydrates = 74, Fat = 1.5, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Whole Grain Spaghetti", Description = "Whole grain spaghetti", Category = "Dry Goods", Calories = 350, Protein = 13, Carbohydrates = 62, Fat = 2.5, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Gluten-Free Pasta", Description = "Pasta made with gluten-free flour", Category = "Dry Goods", Calories = 370, Protein = 8, Carbohydrates = 78, Fat = 1, Allergens = null, ProducerId = defaultProducer.Id},
                    new Product { Name = "Tomato Paste", Description = "Concentrated tomato paste", Category = "Dry Goods", Calories = 85, Protein = 4, Carbohydrates = 19, Fat = 0.5, Allergens = null, ProducerId = defaultProducer.Id}
                };

                context.Products.AddRange(products);
                await context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred during seeding: {ex.Message}");
        }
    }

    /// <summary>
    /// Ensures the required roles exist in the system.
    /// </summary>
    /// <param name="roleManager">The role manager to manage roles.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
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

    /// <summary>
    /// Ensures an admin user exists in the system.
    /// </summary>
    /// <param name="userManager">The user manager to manage users.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    private static async Task EnsureAdminUserExistsAsync(UserManager<IdentityUser> userManager)
    {
        var adminUser = await userManager.FindByNameAsync("Admin");

        if (adminUser == null)
        {
            adminUser = new IdentityUser
            {
                UserName = "Admin",
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
            if (!await userManager.IsInRoleAsync(adminUser, UserRoles.Administrator))
            {
                await userManager.AddToRoleAsync(adminUser, UserRoles.Administrator); // Make sure Admin is in the admin role.
            }
        }
    }

    /// <summary>
    /// Ensures a default producer user exists in the system.
    /// </summary>
    /// <param name="userManager">The user manager to manage users.</param>
    /// <returns>The default producer user.</returns>
    private static async Task<IdentityUser> EnsureDefaultProducerExistsAsync(UserManager<IdentityUser> userManager)
    {
        var producerUsername = "Default_Producer";
        var producerUser = await userManager.FindByNameAsync(producerUsername);

        if (producerUser == null)
        {
            producerUser = new IdentityUser
            {
                UserName = producerUsername,
            };

            var result = await userManager.CreateAsync(producerUser, "OsloMet2024");
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Failed to create Default_Producer user: {errors}");
            }

            await userManager.AddToRoleAsync(producerUser, UserRoles.FoodProducer);
        }

        return producerUser;
    }
}
