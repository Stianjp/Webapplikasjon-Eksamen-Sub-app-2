namespace Sub_App_1.DAL.Repositories;

using Microsoft.EntityFrameworkCore;
using Sub_App_1.Models;
using Sub_App_1.DAL.Interfaces;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task CreateProductAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateProductAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }

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

    public async Task<IEnumerable<Product>> GetProductsByProducerIdAsync(string producerId)
    {
        return await _context.Products.Where(p => p.ProducerId == producerId).ToListAsync();
    }

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

    public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
    {
        return await _context.Products
                             .Where(p => p.CategoryList.Contains(category))
                             .ToListAsync();
    }

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