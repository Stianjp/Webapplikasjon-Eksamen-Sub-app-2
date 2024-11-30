namespace api.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Security.Claims;
    using api.Models;
    using api.DAL.Interfaces;
    using System.Linq;
    using System.Threading.Tasks;

    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        private readonly List<string> _availableCategories = new List<string> {
            "Meat", "Fish", "Vegetable", "Fruit", "Pasta", "Legume", "Drink"
        };

        private readonly List<string> _availableAllergens = new List<string>{
            "Milk", "Egg", "Peanut", "Soy", "Wheat", "Tree Nut", "Shellfish", "Fish", "Sesame", "None"
        };

        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        private bool IsAdmin()
        {
            return User?.IsInRole(UserRoles.Administrator) ?? false;
        }

        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<ProductDTO>), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productRepository.GetAllProductsAsync();
            
            var productDtos = products.Select(p => new ProductDTO
            {
                Name = p.Name,
                Description = p.Description,
                Category = p.Category,
                Calories = p.Calories,
                Protein = p.Protein,
                Fat = p.Fat,
                Carbohydrates = p.Carbohydrates,
                ProducerId = p.ProducerId,  // Map ProducerId
                CategoryList = p.CategoryList  // Map CategoryList
            }).ToList();
            
            return Ok(productDtos);
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ProductDTO), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetProductDetails(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var productDto = new ProductDTO
            {
                Name = product.Name,
                Description = product.Description,
                Category = product.Category,
                Calories = product.Calories,
                Protein = product.Protein,
                Fat = product.Fat,
                Carbohydrates = product.Carbohydrates,
                ProducerId = product.ProducerId,  // Map ProducerId
                CategoryList = product.CategoryList  // Map CategoryList
            };

            return Ok(productDto);
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(ProductDTO), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            try
            {
                product.ProducerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(product.ProducerId))
                {
                    return BadRequest(new { message = "Unable to determine your producer account. Please log in again." });
                }

                await _productRepository.CreateProductAsync(product);
                
                var productDto = new ProductDTO
                {
                    Name = product.Name,
                    Description = product.Description,
                    Category = product.Category,
                    Calories = product.Calories,
                    Protein = product.Protein,
                    Fat = product.Fat,
                    Carbohydrates = product.Carbohydrates,
                    ProducerId = product.ProducerId,  // Map ProducerId
                    CategoryList = product.CategoryList  // Map CategoryList
                };

                return CreatedAtAction(nameof(GetProductDetails), new { id = product.Id }, productDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex}");
                return StatusCode(500, new { message = "An error occurred while creating the product." });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updatedProduct)
        {
            if (id != updatedProduct.Id)
            {
                return BadRequest(new { message = "Product ID mismatch." });
            }

            var product = await _productRepository.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            if (!IsAdmin() && product.ProducerId != User.FindFirstValue(ClaimTypes.NameIdentifier))
            {
                return Forbid();
            }

            try
            {
                await _productRepository.UpdateProductAsync(updatedProduct);
                
                var productDto = new ProductDTO
                {
                    Name = updatedProduct.Name,
                    Description = updatedProduct.Description,
                    Category = updatedProduct.Category,
                    Calories = updatedProduct.Calories,
                    Protein = updatedProduct.Protein,
                    Fat = updatedProduct.Fat,
                    Carbohydrates = updatedProduct.Carbohydrates,
                    ProducerId = updatedProduct.ProducerId,  // Map ProducerId
                    CategoryList = updatedProduct.CategoryList  // Map CategoryList
                };

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating product: {ex}");
                return StatusCode(500, new { message = "An error occurred while updating the product." });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            if (!IsAdmin() && product.ProducerId != User.FindFirstValue(ClaimTypes.NameIdentifier))
            {
                return Forbid();
            }

            var success = await _productRepository.DeleteProductAsync(id);

            if (!success)
            {
                return BadRequest(new { message = "Unable to delete product." });
            }

            return NoContent();
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public IActionResult GetAvailableCategories()
        {
            return Ok(_availableCategories);
        }

        [HttpGet("user-products")]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<ProductDTO>), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetUserProducts([FromQuery] string? category = null)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
            {
                return BadRequest(new { message = "User ID is invalid." });
            }

            var products = await _productRepository.GetProductsByProducerIdAsync(currentUserId);

            if (!string.IsNullOrEmpty(category))
            {
                products = products.Where(p => p.CategoryList.Contains(category)).ToList();
            }

            var allCategories = await _productRepository.GetAllCategoriesAsync();

            var productDtos = products.Select(p => new ProductDTO
            {
                Name = p.Name,
                Description = p.Description,
                Category = p.Category,
                Calories = p.Calories,
                Protein = p.Protein,
                Fat = p.Fat,
                Carbohydrates = p.Carbohydrates,
                ProducerId = p.ProducerId,  // Map ProducerId
                CategoryList = p.CategoryList  // Map CategoryList
            }).ToList();

            return Ok(new
            {
                products = productDtos,
                categories = allCategories.OrderBy(c => c).ToList()
            });
        }
    }
}