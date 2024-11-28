namespace api.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using api.Models;
using api.DAL.Interfaces;

/// <summary>
/// Handles operations related to products, including creation, retrieval, updating, and deletion.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _productRepository;

    // Define the list of available categories
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
    /// Checks if the current user has the Administrator role.
    /// </summary>
    /// <returns>True if the user is an administrator; otherwise, false.</returns>
    private bool IsAdmin()
    {
        return User?.IsInRole(UserRoles.Administrator) ?? false;
    }

    /// <summary>
    /// Retrieves all products.
    /// </summary>
    /// <returns>A list of all products.</returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _productRepository.GetAllProductsAsync();
        return Ok(products);
    }

    /// <summary>
    /// Retrieves details of a specific product by ID.
    /// </summary>
    /// <param name="id">The ID of the product.</param>
    /// <returns>The product details if found; otherwise, a 404 response.</returns>
    [HttpGet("{id}")]
    [AllowAnonymous]
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
    /// Creates a new product.
    /// </summary>
    /// <param name="product">The product to create.</param>
    /// <returns>The created product details and its URI if successful.</returns>
    [HttpPost]
    [Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
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
            return CreatedAtAction(nameof(GetProductDetails), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex}");
            return StatusCode(500, new { message = "An error occurred while creating the product." });
        }
    }

    /// <summary>
    /// Updates an existing product.
    /// </summary>
    /// <param name="id">The ID of the product to update.</param>
    /// <param name="updatedProduct">The updated product details.</param>
    /// <returns>A 204 response if successful; otherwise, an error response.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
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
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating product: {ex}");
            return StatusCode(500, new { message = "An error occurred while updating the product." });
        }
    }

    /// <summary>
    /// Deletes an existing product.
    /// </summary>
    /// <param name="id">The ID of the product to delete.</param>
    /// <returns>A 204 response if successful; otherwise, an error response.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
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
    /// Retrieves the list of available product categories.
    /// </summary>
    /// <returns>A list of available product categories.</returns>
    [HttpGet("categories")]
    [AllowAnonymous]
    public IActionResult GetAvailableCategories()
    {
        return Ok(_availableCategories);
    }

    /// <summary>
    /// Retrieves products created by the current user.
    /// </summary>
    /// <param name="category">An optional category to filter the products by.</param>
    /// <returns>A list of products created by the user, filtered by category if provided.</returns>
    [HttpGet("user-products")]
    [Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
    public async Task<IActionResult> GetUserProducts([FromQuery] string? category = null)
    {
        string currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return BadRequest(new { message = "User ID is invalid." });
        }

        var products = await _productRepository.GetProductsByProducerIdAsync(currentUserId);

        if (!string.IsNullOrEmpty(category))
        {
            products = products.Where(p => p.CategoryList.Contains(category)).ToList();
        }

        return Ok(products);
    }
}
