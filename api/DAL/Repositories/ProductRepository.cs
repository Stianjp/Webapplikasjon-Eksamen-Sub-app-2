namespace api.DAL.Repositories;

using Microsoft.EntityFrameworkCore;
using api.Models;
using api.DAL.Interfaces;

/// <summary>
/// Provides CRUD operations and other functionalities for managing products in the database.
/// </summary>
public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    /// <summary>
    /// Initializes a new instance of the <see cref="ProductRepository"/> class.
    /// </summary>
    /// <param name="context">The database context for interacting with products.</param>
    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all products from the database.
    /// </summary>
    /// <returns>A collection of all products.</returns>
    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _context.Products.ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific product by its unique ID.
    /// </summary>
    /// <param name="id">The ID of the product to retrieve.</param>
    /// <returns>The product if found; otherwise, null.</returns>
    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    /// <summary>
    /// Creates a new product and saves it to the database.
    /// </summary>
    /// <param name="product">The product to create.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task CreateProductAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Updates an existing product in the database.
    /// </summary>
    /// <param name="product">The product with updated details.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task UpdateProductAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Deletes a product by its unique ID.
    /// </summary>
    /// <param name="id">The ID of the product to delete.</param>
    /// <returns>
    /// True if the product was successfully deleted; false if the product does not exist.
    /// </returns>
    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await GetProductByIdAsync(id);

        if (product == null)
        {
            return false;
        }
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Retrieves all products created by a specific producer.
    /// </summary>
    /// <param name="producerId">The ID of the producer.</param>
    /// <returns>A collection of products created by the specified producer.</returns>
    public async Task<IEnumerable<Product>> GetProductsByProducerIdAsync(string producerId)
    {
        return await _context.Products.Where(p => p.ProducerId == producerId).ToListAsync();
    }

    /// <summary>
    /// Retrieves all distinct product categories.
    /// </summary>
    /// <returns>A collection of all unique product categories.</returns>
    public async Task<IEnumerable<string>> GetAllCategoriesAsync()
    {
        // Load products from the database and switch to in-memory processing
        var products = await _context.Products.AsNoTracking().ToListAsync();

        // Process categories in memory to avoid translation issues
        var categories = products
            .SelectMany(p => p.CategoryList)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return categories;
    }

    /// <summary>
    /// Retrieves all products within a specific category.
    /// </summary>
    /// <param name="category">The category to filter products by.</param>
    /// <returns>A collection of products within the specified category.</returns>
    public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
    {
        return await _context.Products
                             .Where(p => p.CategoryList.Contains(category))
                             .ToListAsync();
    }

    /// <summary>
    /// Retrieves all products sorted by the specified field.
    /// </summary>
    /// <param name="sortBy">The field to sort by (e.g., "name" or "calories").</param>
    /// <returns>A collection of products sorted by the specified field.</returns>
    public async Task<IEnumerable<Product>> GetSortedProductsAsync(string sortBy)
    {
        IQueryable<Product> query = _context.Products;

        query = sortBy.ToLower() switch
        {
            "name" => query.OrderBy(p => p.Name),
            "calories" => query.OrderBy(p => p.Calories),
            _ => query // No sorting if sortBy is unrecognized
        };

        return await query.ToListAsync();
    }
}