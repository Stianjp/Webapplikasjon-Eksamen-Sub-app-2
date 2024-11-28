namespace api.DAL.Interfaces;

using api.Models;

/// <summary>
/// Defines the contract for product-related data operations, including CRUD functionality and specialized queries.
/// </summary>
public interface IProductRepository
{
    /// <summary>
    /// Retrieves all products from the database.
    /// </summary>
    /// <returns>A collection of all products.</returns>
    Task<IEnumerable<Product>> GetAllProductsAsync();

    /// <summary>
    /// Retrieves a specific product by its unique ID.
    /// </summary>
    /// <param name="id">The unique ID of the product to retrieve.</param>
    /// <returns>The product if found; otherwise, null.</returns>
    Task<Product?> GetProductByIdAsync(int id);

    /// <summary>
    /// Creates a new product in the database.
    /// </summary>
    /// <param name="product">The product to create.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task CreateProductAsync(Product product);

    /// <summary>
    /// Updates an existing product in the database.
    /// </summary>
    /// <param name="product">The product with updated details.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task UpdateProductAsync(Product product);

    /// <summary>
    /// Deletes a product by its unique ID.
    /// </summary>
    /// <param name="id">The unique ID of the product to delete.</param>
    /// <returns>
    /// True if the product was successfully deleted; false if the product does not exist.
    /// </returns>
    Task<bool> DeleteProductAsync(int id);

    /// <summary>
    /// Retrieves all products created by a specific producer.
    /// </summary>
    /// <param name="producerId">The ID of the producer.</param>
    /// <returns>A collection of products created by the specified producer.</returns>
    Task<IEnumerable<Product>> GetProductsByProducerIdAsync(string producerId);

    /// <summary>
    /// Retrieves all unique product categories.
    /// </summary>
    /// <returns>A collection of all distinct product categories.</returns>
    Task<IEnumerable<string>> GetAllCategoriesAsync();

    /// <summary>
    /// Retrieves all products within a specific category.
    /// </summary>
    /// <param name="category">The category to filter products by.</param>
    /// <returns>A collection of products within the specified category.</returns>
    Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category);

    /// <summary>
    /// Retrieves all products sorted by the specified field.
    /// </summary>
    /// <param name="sortBy">The field to sort by (e.g., "name" or "calories").</param>
    /// <returns>A collection of products sorted by the specified field.</returns>
    Task<IEnumerable<Product>> GetSortedProductsAsync(string sortBy);
}
