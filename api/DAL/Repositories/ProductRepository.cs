using Microsoft.EntityFrameworkCore;
using api.DAL.Interfaces;
using api.Models;
using api.DTO;

namespace api.DAL.Repositories
{
    /// <summary>
    /// Repository implementation for managing Product entities in the database.
    /// Handles all database operations for products including CRUD operations.
    /// </summary>
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        /// <summary>
        /// Initializes a new instance of the ProductRepository
        /// </summary>
        /// <param name="context">Database context for product operations</param>
        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Maps a Product entity to a ProductDTO
        /// </summary>
        /// <param name="product">Product entity to convert</param>
        /// <returns>Converted ProductDTO object</returns>
        private ProductDTO MapToDTO(Product product)
        {
            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                CategoryList = product.CategoryList,
                Calories = product.Calories,
                Protein = product.Protein,
                Fat = product.Fat,
                Carbohydrates = product.Carbohydrates,
                Allergens = product.Allergens,
                ProducerId = product.ProducerId
            };
        }

        /// <summary>
        /// Maps a ProductDTO to a Product entity
        /// </summary>
        /// <param name="productDTO">ProductDTO to convert</param>
        /// <returns>Converted Product entity</returns>
        private Product MapToModel(ProductDTO productDTO)
        {
            return new Product
            {
                Id = productDTO.Id,
                Name = productDTO.Name,
                Description = productDTO.Description,
                CategoryList = productDTO.CategoryList,
                Calories = productDTO.Calories,
                Protein = productDTO.Protein,
                Fat = productDTO.Fat,
                Carbohydrates = productDTO.Carbohydrates,
                Allergens = productDTO.Allergens,
                ProducerId = productDTO.ProducerId
            };
        }

        /// <summary>
        /// Retrieves all products from the database
        /// </summary>
        /// <returns>Collection of all products as DTOs</returns>
        public async Task<IEnumerable<ProductDTO>> GetAllProductsAsync()
        {
            var products = await _context.Products.ToListAsync();
            return products.Select(MapToDTO);
        }

        /// <summary>
        /// Retrieves a specific product by its ID
        /// </summary>
        /// <param name="id">ID of the product to retrieve</param>
        /// <returns>ProductDTO if found, null if not found</returns>
        public async Task<ProductDTO?> GetProductByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            return product == null ? null : MapToDTO(product);
        }

        /// <summary>
        /// Creates a new product in the database
        /// </summary>
        /// <param name="productDTO">Product data to create</param>
        public async Task CreateProductAsync(ProductDTO productDTO)
        {
            var product = MapToModel(productDTO);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Updates an existing product in the database
        /// </summary>
        /// <param name="id">ID of product to update</param>
        /// <param name="productDTO">Updated product data</param>
        public async Task UpdateProductAsync(int id, ProductDTO productDTO)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return;

            product.Name = productDTO.Name;
            product.Description = productDTO.Description;
            product.CategoryList = productDTO.CategoryList;
            product.Calories = productDTO.Calories;
            product.Protein = productDTO.Protein;
            product.Fat = productDTO.Fat;
            product.Carbohydrates = productDTO.Carbohydrates;
            product.Allergens = productDTO.Allergens;
            product.ProducerId = productDTO.ProducerId;

            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Deletes a product from the database
        /// </summary>
        /// <param name="id">ID of product to delete</param>
        /// <returns>True if product was deleted, false if not found</returns>
        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Retrieves all products for a specific producer
        /// </summary>
        /// <param name="producerId">ID of the producer</param>
        /// <returns>Collection of products created by the producer</returns>
        public async Task<IEnumerable<ProductDTO>> GetProductsByProducerIdAsync(string producerId)
        {
            var products = await _context.Products
                .Where(p => p.ProducerId == producerId)
                .ToListAsync();
            
            return products.Select(MapToDTO);
        }

        /// <summary>
        /// Retrieves all unique categories from existing products
        /// </summary>
        /// <returns>Collection of unique category names</returns>
        public async Task<IEnumerable<string>> GetAllCategoriesAsync()
        {
            var products = await _context.Products.AsNoTracking().ToListAsync();
            return products.SelectMany(p => p.CategoryList)
                          .Distinct()
                          .OrderBy(c => c)
                          .ToList();
        }

        /// <summary>
        /// Retrieves all products in a specific category
        /// </summary>
        /// <param name="category">Category to filter by</param>
        /// <returns>Collection of products in the specified category</returns>
        public async Task<IEnumerable<ProductDTO>> GetProductsByCategoryAsync(string category)
        {
            var products = await _context.Products
                .Where(p => p.CategoryList.Contains(category))
                .ToListAsync();
            return products.Select(MapToDTO);
        }

        /// <summary>
        /// Retrieves products sorted by a specified property
        /// </summary>
        /// <param name="sortBy">Property to sort by (name, calories, protein, fat, carbohydrates)</param>
        /// <returns>Collection of sorted products</returns>
        public async Task<IEnumerable<ProductDTO>> GetSortedProductsAsync(string sortBy)
        {
            IQueryable<Product> query = _context.Products;

            query = sortBy.ToLower() switch
            {
                "name" => query.OrderBy(p => p.Name),
                "calories" => query.OrderBy(p => p.Calories),
                "protein" => query.OrderBy(p => p.Protein),
                "fat" => query.OrderBy(p => p.Fat),
                "carbohydrates" => query.OrderBy(p => p.Carbohydrates),
                _ => query.OrderBy(p => p.Id)  // Default sorting by Id
            };

            var products = await query.ToListAsync();
            return products.Select(MapToDTO);
        }
    }
}