namespace api.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using api.Models;
using api.DAL.Interfaces;

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

    private bool IsAdmin()
    {
        return User?.IsInRole(UserRoles.Administrator) ?? false;
    }

    // GET: api/Products
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _productRepository.GetAllProductsAsync();
        return Ok(products);
    }

    // GET: api/Products/{id}
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

    // POST: api/Products
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

    // PUT: api/Products/{id}
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

    // DELETE: api/Products/{id}
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

    // GET: api/Products/Categories
    [HttpGet("categories")]
    [AllowAnonymous]
    public IActionResult GetAvailableCategories()
    {
        return Ok(_availableCategories);
    }

    // GET: api/Products/UserProducts
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
