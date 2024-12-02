using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using api.Models;
using api.DTO;
using api.DAL.Interfaces;

namespace api.Controllers
{
    /// <summary>
/// Provides products functionalities for products, add also some admin product finctionalites.
/// Requires the user to have one of the 3 roles, this dependes what method
/// </summary>
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
    /// <summary>
/// Checks user roles isAdmin ir not
/// </summary>
        private bool IsAdmin()
        {
            return User?.IsInRole(UserRoles.Administrator) ?? false;
        }

           /// <summary>
        /// Gets a list of all products from the database.
        /// Returns a collection of ProductDTO objects.
        /// No authentication required due to [AllowAnonymous] attribute.
        /// </summary>
        /// <returns>
        /// 200 OK with a list of ProductDTO objects if successful
        /// 400 Bad Request if the operation fails
        /// </returns>
        [HttpGet("GetAllProducts")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<ProductDTO>), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productRepository.GetAllProductsAsync();
            return Ok(products);
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

            return Ok(product);
        }

        [HttpPost("CreateProduct")]
        [Authorize]
        [ProducesResponseType(typeof(ProductDTO), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDTO productDto)
        {
            try
            {
                productDto.ProducerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(productDto.ProducerId))
                {
                    return BadRequest(new { message = "Unable to determine your producer account. Please log in again." });
                }

                await _productRepository.CreateProductAsync(productDto);
                return CreatedAtAction(nameof(GetProductDetails), new { id = productDto.Id }, productDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex}");
                return StatusCode(500, new { message = "An error occurred while creating the product." });
            }
        }

        [HttpPut("UpdateProduct{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDTO productDto)
        {
            if (id != productDto.Id)
            {
                return BadRequest(new { message = "Product ID mismatch." });
            }
           
            var existingProduct = await _productRepository.GetProductByIdAsync(id);

            if (existingProduct == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            if (!IsAdmin() && existingProduct.ProducerId != User.FindFirstValue(ClaimTypes.NameIdentifier))
            {
                return Forbid();
            }

            try
            {
                await _productRepository.UpdateProductAsync(id, productDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating product: {ex}");
                return StatusCode(500, new { message = "An error occurred while updating the product." });
            }
        }

        [HttpDelete("DeleteProduct{id}")]
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

        [HttpGet("allergens")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public IActionResult GetAvailableAllergens()
        {
            return Ok(_availableAllergens);
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

            return Ok(new
            {
                products = products,
                categories = allCategories.OrderBy(c => c).ToList()
            });
        }

        [HttpPut("admin/products/{id}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> AdminUpdateProduct(int id, [FromBody] ProductDTO productDto)
        {
            if (id != productDto.Id)
            {
                return BadRequest(new { message = "Product ID mismatch." });
            }

            var existingProduct = await _productRepository.GetProductByIdAsync(id);
            if (existingProduct == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            try
            {
                await _productRepository.UpdateProductAsync(id, productDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating product: {ex}");
                return StatusCode(500, new { message = "An error occurred while updating the product." });
            }
        }

        [HttpDelete("admin/products/{id}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> AdminDeleteProduct(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var success = await _productRepository.DeleteProductAsync(id);
            
            if (!success)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the product." });
            }

            return NoContent();
        }

        [HttpGet("admin/all-products")]
        [Authorize(Roles = "Administrator")] // Ensures only admins can access
        public async Task<IActionResult> GetAllProductsAdmin([FromQuery] string? sortBy = null, [FromQuery] string? category = null)
        {
            var products = await _productRepository.GetAllProductsAsync();
            
            // Apply filters if provided
            if (!string.IsNullOrEmpty(category))
            {
                products = products.Where(p => p.CategoryList.Contains(category)).ToList();
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                products = await _productRepository.GetSortedProductsAsync(sortBy);
            }

            var allCategories = await _productRepository.GetAllCategoriesAsync();

            return Ok(new
            {
                products = products,
                categories = allCategories.OrderBy(c => c).ToList()
            });
        }
    }
}