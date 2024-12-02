namespace api.DAL.Interfaces
{
   using api.DTO;

   /// <summary>
   /// Interface defining operations for managing products in the database
   /// </summary>
   public interface IProductRepository
   {
       /// <summary>
       /// Retrieves all products from the database
       /// </summary>
       /// <returns>Collection of all products as DTOs</returns>
       Task<IEnumerable<ProductDTO>> GetAllProductsAsync();

       /// <summary>
       /// Retrieves a specific product by its ID
       /// </summary>
       /// <param name="id">ID of the product to retrieve</param>
       /// <returns>ProductDTO if found, null if not found</returns>
       Task<ProductDTO?> GetProductByIdAsync(int id);

       /// <summary>
       /// Creates a new product in the database
       /// </summary>
       /// <param name="productDTO">Product data to create</param>
       Task CreateProductAsync(ProductDTO productDTO);

       /// <summary>
       /// Updates an existing product in the database
       /// </summary>
       /// <param name="id">ID of product to update</param>
       /// <param name="productDTO">Updated product data</param>
       Task UpdateProductAsync(int id, ProductDTO productDTO);

       /// <summary>
       /// Deletes a product from the database
       /// </summary>
       /// <param name="id">ID of product to delete</param>
       /// <returns>True if product was deleted, false if not found</returns>
       Task<bool> DeleteProductAsync(int id);

       /// <summary>
       /// Retrieves all products for a specific producer
       /// </summary>
       /// <param name="producerId">ID of the producer</param>
       /// <returns>Collection of products created by the producer</returns>
       Task<IEnumerable<ProductDTO>> GetProductsByProducerIdAsync(string producerId);

       /// <summary>
       /// Retrieves all unique categories from existing products
       /// </summary>
       /// <returns>Collection of unique category names</returns>
       Task<IEnumerable<string>> GetAllCategoriesAsync();

       /// <summary>
       /// Retrieves all products in a specific category
       /// </summary>
       /// <param name="category">Category to filter by</param>
       /// <returns>Collection of products in the specified category</returns>
       Task<IEnumerable<ProductDTO>> GetProductsByCategoryAsync(string category);

       /// <summary>
       /// Retrieves products sorted by a specified property
       /// </summary>
       /// <param name="sortBy">Property to sort by (name, calories, protein, fat, carbohydrates)</param>
       /// <returns>Collection of sorted products</returns>
       Task<IEnumerable<ProductDTO>> GetSortedProductsAsync(string sortBy);
   }
}