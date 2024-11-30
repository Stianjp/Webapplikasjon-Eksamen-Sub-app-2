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
    /// Maps a Product entity to a ProductDTO.
    /// </summary>
    /// <param name="product">The Product entity to map.</param>
    /// <returns>The mapped ProductDTO.</returns>
    private ProductDTO MapToDTO(Product product)
    {
        return new ProductDTO
        {
            Name = product.Name,
            Description = product.Description,
            Category = product.CategoryList != null ? string.Join(", ", product.CategoryList) : string.Empty,
            Calories = product.Calories,
            Protein = product.Protein,
            Fat = product.Fat,
            Carbohydrates = product.Carbohydrates
        };
    }

    /// <summary>
    /// Maps a ProductDTO to a Product entity.
    /// </summary>
    /// <param name="productDto">The ProductDTO to map.</param>
    /// <returns>The mapped Product entity.</returns>
    private Product MapToModel(ProductDTO productDto)
    {
        return new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            CategoryList = productDto.Category.Split(',').Select(c => c.Trim()).ToList(),
            Calories = productDto.Calories,
            Protein = productDto.Protein,
            Fat = productDto.Fat,
            Carbohydrates = productDto.Carbohydrates
        };
    }

    /// <summary>
    /// Retrieves all products from the database.
    /// </summary>
    /// <returns>A collection of all products as ProductDTOs.</returns>
    public async Task<IEnumerable<ProductDTO>> GetAllProductsAsync()
    {
        var products = await _context.Products.ToListAsync();
        return products.Select(p => MapToDTO(p));
    }

    /// <summary>
    /// Retrieves a specific product by its unique ID.
    /// </summary>
    /// <param name="id">The ID of the product to retrieve.</param>
    /// <returns>The product as a ProductDTO if found; otherwise, null.</returns>
    public async Task<ProductDTO?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return null;
        }
        return MapToDTO(product);
    }

    /// <summary>
    /// Creates a new product and saves it to the database.
    /// </summary>
    /// <param name="productDto">The product to create as a ProductDTO.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task CreateProductAsync(ProductDTO productDto)
    {
        var product = MapToModel(productDto);
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Updates an existing product in the database.
    /// </summary>
    /// <param name="id">The ID of the product to update.</param>
    /// <param name="productDto">The product with updated details as a ProductDTO.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task UpdateProductAsync(int id, ProductDTO productDto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return;
        }

        // Map updated values from ProductDTO to Product entity
        product.Name = productDto.Name;
        product.Description = productDto.Description;
        product.CategoryList = productDto.Category.Split(',').Select(c => c.Trim()).ToList();
        product.Calories = productDto.Calories;
        product.Protein = productDto.Protein;
        product.Fat = productDto.Fat;
        product.Carbohydrates = productDto.Carbohydrates;

        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Deletes a product by its unique ID.
    /// </summary>
    /// <param name="id">The ID of the product to delete.</param>
    /// <returns>True if the product was successfully deleted; false if the product does not exist.</returns>
    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
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
    /// <returns>A collection of products created by the specified producer as ProductDTOs.</returns>
    public async Task<IEnumerable<ProductDTO>> GetProductsByProducerIdAsync(string producerId)
    {
        var products = await _context.Products.Where(p => p.ProducerId == producerId).ToListAsync();
        return products.Select(p => MapToDTO(p));
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
    /// <returns>A collection of products within the specified category as ProductDTOs.</returns>
    public async Task<IEnumerable<ProductDTO>> GetProductsByCategoryAsync(string category)
    {
        var products = await _context.Products
                                     .Where(p => p.CategoryList.Contains(category))
                                     .ToListAsync();
        return products.Select(p => MapToDTO(p));
    }

    /// <summary>
    /// Retrieves all products sorted by the specified field.
    /// </summary>
    /// <param name="sortBy">The field to sort by (e.g., "name" or "calories").</param>
    /// <returns>A collection of products sorted by the specified field as ProductDTOs.</returns>
    public async Task<IEnumerable<ProductDTO>> GetSortedProductsAsync(string sortBy)
    {
        IQueryable<Product> query = _context.Products;

        query = sortBy.ToLower() switch
        {
            "name" => query.OrderBy(p => p.Name),
            "calories" => query.OrderBy(p => p.Calories),
            _ => query // No sorting if sortBy is unrecognized
        };

        var products = await query.ToListAsync();
        return products.Select(p => MapToDTO(p));
    }
}