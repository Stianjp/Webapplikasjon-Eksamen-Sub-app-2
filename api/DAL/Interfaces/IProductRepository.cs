namespace api.DAL.Interfaces
{
    using api.DTO;
    public interface IProductRepository
    {
        Task<IEnumerable<ProductDTO>> GetAllProductsAsync();
        Task<ProductDTO?> GetProductByIdAsync(int id);
        Task CreateProductAsync(ProductDTO productDTO);
        Task UpdateProductAsync(int id, ProductDTO productDTO); // Changed to use int id
        Task<bool> DeleteProductAsync(int id);
        Task<IEnumerable<ProductDTO>> GetProductsByProducerIdAsync(string producerId);
        Task<IEnumerable<string>> GetAllCategoriesAsync();
        Task<IEnumerable<ProductDTO>> GetProductsByCategoryAsync(string category);
        Task<IEnumerable<ProductDTO>> GetSortedProductsAsync(string sortBy);
    }
}