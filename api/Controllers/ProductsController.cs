using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using api.Models;
using api.DTO;
using api.DAL.Interfaces;

namespace api.Controllers
{
    /// <summary>
    /// Controller for managing products in the system.
    /// Provides endpoints for CRUD operations on products with role-based access control.
    /// Various endpoints require different authentication levels (Anonymous, Authenticated, Admin).
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        /// <summary>
        /// List of valid product categories supported by the system
        /// </summary>
        private readonly List<string> _availableCategories = new List<string> {
            "Meat", "Fish", "Vegetable", "Fruit", "Pasta", "Legume", "Drink"
        };

        /// <summary>
        /// List of valid allergens that can be assigned to products
        /// </summary>
        private readonly List<string> _availableAllergens = new List<string>{
            "Milk", "Egg", "Peanut", "Soy", "Wheat", "Tree Nut", "Shellfish", "Fish", "Sesame", "None"
        };

        /// <summary>
        /// Constructor that initializes the product repository dependency
        /// </summary>
        /// <param name="productRepository">Repository for product data operations</param>
        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        /// <summary>
        /// Checks if the current user has Administrator role
        /// </summary>
        /// <returns>True if user is admin, false otherwise</returns>
        private bool IsAdmin()
        {
            return User?.IsInRole(UserRoles.Administrator) ?? false;
        }

        /// <summary>
        /// Gets a list of all products from the database.
        /// No authentication required.
        /// </summary>
        /// <returns>
        /// 200 OK with list of ProductDTO objects if successful
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

        /// <summary>
        /// Gets details of a specific product by ID.
        /// No authentication required.
        /// </summary>
        /// <param name="id">Product ID to retrieve</param>
        /// <returns>
        /// 200 OK with product details
        /// 404 Not Found if product doesn't exist
        /// </returns>
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

        /// <summary>
        /// Creates a new product in the system.
        /// Requires authenticated user.
        /// Sets current user as the producer.
        /// </summary>
        /// <param name="productDto">Product data</param>
        /// <returns>
        /// 201 Created with product details
        /// 400 Bad Request if input is invalid
        /// </returns>
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

        /// <summary>
        /// Updates an existing product.
        /// Requires authentication and user must be admin or original producer.
        /// </summary>
        /// <param name="id">Product ID to update</param>
        /// <param name="productDto">Updated product data</param>
        /// <returns>
        /// 204 NoContent if successful
        /// 400 Bad Request if input invalid
        /// 404 Not Found if product doesn't exist
        /// 403 Forbidden if user unauthorized
        /// </returns>
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

        /// <summary>
        /// Deletes a product from the system.
        /// Requires authentication and user must be admin or original producer.
        /// </summary>
        /// <param name="id">Product ID to delete</param>
        /// <returns>
        /// 204 NoContent if successful
        /// 404 Not Found if product doesn't exist
        /// 403 Forbidden if user unauthorized
        /// </returns>
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

        /// <summary>
        /// Gets list of available product categories.
        /// No authentication required.
        /// </summary>
        /// <returns>200 OK with list of categories</returns>
        [HttpGet("categories")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public IActionResult GetAvailableCategories()
        {
            return Ok(_availableCategories);
        }

        /// <summary>
        /// Gets list of available allergens.
        /// No authentication required.
        /// </summary>
        /// <returns>200 OK with list of allergens</returns>
        [HttpGet("allergens")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public IActionResult GetAvailableAllergens()
        {
            return Ok(_availableAllergens);
        }

        /// <summary>
        /// Gets products created by the current user.
        /// Optionally filtered by category.
        /// Requires authentication.
        /// </summary>
        /// <param name="category">Optional category to filter by</param>
        /// <returns>
        /// 200 OK with products and categories
        /// 400 Bad Request if user ID invalid
        /// </returns>
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

        /// <summary>
        /// Admin-only endpoint to update any product.
        /// Bypasses producer ownership check.
        /// </summary>
        /// <param name="id">Product ID to update</param>
        /// <param name="productDto">Updated product data</param>
        /// <returns>
        /// 204 NoContent if successful
        /// 400 Bad Request if input invalid
        /// 404 Not Found if product doesn't exist
        /// </returns>
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

        /// <summary>
        /// Admin-only endpoint to delete any product.
        /// Bypasses producer ownership check.
        /// </summary>
        /// <param name="id">Product ID to delete</param>
        /// <returns>
        /// 204 NoContent if successful
        /// 404 Not Found if product doesn't exist
        /// </returns>
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

        /// <summary>
        /// Admin-only endpoint to get all products with sorting and filtering options.
        /// </summary>
        /// <param name="sortBy">Optional parameter to sort results</param>
        /// <param name="category">Optional category to filter by</param>
        /// <returns>200 OK with products and categories</returns>
        [HttpGet("admin/all-products")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetAllProductsAdmin([FromQuery] string? sortBy = null, [FromQuery] string? category = null)
        {
            var products = await _productRepository.GetAllProductsAsync();
            
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