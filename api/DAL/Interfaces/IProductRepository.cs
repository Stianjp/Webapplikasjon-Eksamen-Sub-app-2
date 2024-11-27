namespace Sub_App_1.DAL.Interfaces;

using Sub_App_1.Models;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task<Product?> GetProductByIdAsync(int id);
    Task CreateProductAsync(Product product);
    Task UpdateProductAsync(Product product);
    Task<bool> DeleteProductAsync(int id);
    Task<IEnumerable<Product>> GetProductsByProducerIdAsync(string producerId);
    Task<IEnumerable<string>> GetAllCategoriesAsync();
    Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category);
    Task<IEnumerable<Product>> GetSortedProductsAsync(string sortBy);
}
