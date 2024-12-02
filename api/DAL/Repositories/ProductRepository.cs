using Microsoft.EntityFrameworkCore;
using api.DAL.Interfaces;
using api.Models;
using api.DTO;

namespace api.DAL.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

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

        public async Task<IEnumerable<ProductDTO>> GetAllProductsAsync()
        {
            var products = await _context.Products.ToListAsync();
            return products.Select(MapToDTO);
        }

        public async Task<ProductDTO?> GetProductByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            return product == null ? null : MapToDTO(product);
        }

        public async Task CreateProductAsync(ProductDTO productDTO)
        {
            var product = MapToModel(productDTO);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

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

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ProductDTO>> GetProductsByProducerIdAsync(string producerId)
        {
            var products = await _context.Products
                .Where(p => p.ProducerId == producerId)
                .ToListAsync();
            
            return products.Select(MapToDTO);
        }

        public async Task<IEnumerable<string>> GetAllCategoriesAsync()
        {
            var products = await _context.Products.AsNoTracking().ToListAsync();
            return products.SelectMany(p => p.CategoryList)
                          .Distinct()
                          .OrderBy(c => c)
                          .ToList();
        }

        public async Task<IEnumerable<ProductDTO>> GetProductsByCategoryAsync(string category)
        {
            var products = await _context.Products
                .Where(p => p.CategoryList.Contains(category))
                .ToListAsync();
            return products.Select(MapToDTO);
        }

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