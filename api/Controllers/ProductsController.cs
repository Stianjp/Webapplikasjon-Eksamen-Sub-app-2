namespace Sub_App_1.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Sub_App_1.Models;
using Sub_App_1.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using Sub_App_1.DAL.Interfaces;

public class ProductsController : Controller
{
    private readonly IProductRepository _productRepository;

    // Define the list of available categories
    private readonly List<string> _availableCategories = new List<string> {
        "Meat",
        "Fish",
        "Vegetable",
        "Fruit",
        "Pasta",
        "Legume",
        "Drink"
    };

    private readonly List<string> _availableAllergens = new List<string>{
        "Milk",
        "Egg",
        "Peanut",
        "Soy",
        "Wheat",
        "Tree Nut",
        "Shellfish",
        "Fish",
        "Sesame",
        "None"
    };

    public ProductsController(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    private bool IsAdmin()
    {
        return User.IsInRole(UserRoles.Administrator);
    }

    // GET: Products (available to all, including not logged in users)
    public async Task<IActionResult> Productsindex()
    {
        var products = await _productRepository.GetAllProductsAsync();
        return View(products);
    }

    // GET: Products/Details/{id}
    public async Task<IActionResult> Details(int id)
    {
        var product = await _productRepository.GetProductByIdAsync(id);

        if (product == null)
        {
            return NotFound();
        }
        return View(product);
    }
// GET: Products/Create
[Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
public IActionResult Create()
{
    ViewBag.AllergenOptions = _availableAllergens;
    ViewBag.CategoryOptions = _availableCategories;
    var viewModel = new ProductFormViewModel
    {
        ProducerId = User.FindFirstValue(ClaimTypes.NameIdentifier)
    };
    return View(viewModel);
}


// POST: Products/Create
[HttpPost]
[ValidateAntiForgeryToken]
[Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
public async Task<IActionResult> Create(ProductFormViewModel viewModel)
{
    try
    {
        viewModel.ProducerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(viewModel.ProducerId))
        {
            return BadRequest("Producer ID is invalid.");
        }

        // Handle CategoryList
        if (viewModel.CategoryList == null || !viewModel.CategoryList.Any())
        {
            ModelState.AddModelError("CategoryList", "Please select at least one category.");
             ViewBag.AllergenOptions = _availableAllergens;
            ViewBag.CategoryOptions = _availableCategories;
            return View(viewModel);
        }

        if (ModelState.IsValid)
        {
            var product = viewModel.ToProduct();
            await _productRepository.CreateProductAsync(product);
            return RedirectToAction(nameof(Productsindex));
        }

        // Log ModelState errors
        foreach (var modelState in ModelState.Values)
        {
            foreach (var error in modelState.Errors)
            {
                Console.WriteLine("ModelState Error: " + error.ErrorMessage);
            }
        }

        ViewBag.AllergenOptions = _availableAllergens;
        ViewBag.CategoryOptions = _availableCategories;
        return View(viewModel);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex}");
        ModelState.AddModelError("", "An error occurred while creating the product.");
        ViewBag.AllergenOptions = _availableAllergens;
        ViewBag.CategoryOptions = _availableCategories;
        return View(viewModel);
    }
}

// GET: Products/Edit/{id}
[Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
public async Task<IActionResult> Edit(int id)
{
    var product = await _productRepository.GetProductByIdAsync(id);

    if (product == null)
    {
        return NotFound();
    }

    if (!IsAdmin() && product.ProducerId != User.FindFirstValue(ClaimTypes.NameIdentifier))
    {
        return Forbid();
    }

    var viewModel = ProductFormViewModel.FromProduct(product);
    ViewBag.AllergenOptions = _availableAllergens;
    ViewBag.CategoryOptions = _availableCategories;
    return View(viewModel);
}

// POST: Products/Edit/{id}
[HttpPost]
[ValidateAntiForgeryToken]
[Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
public async Task<IActionResult> Edit(int id, ProductFormViewModel viewModel)
{
    if (id != viewModel.Id)
    {
        return BadRequest();
    }

    var product = await _productRepository.GetProductByIdAsync(id);

    if (product == null)
    {
        return NotFound();
    }

    if (!IsAdmin() && product.ProducerId != User.FindFirstValue(ClaimTypes.NameIdentifier))
    {
        return Forbid();
    }

    // Handle CategoryList
    if (viewModel.CategoryList == null || !viewModel.CategoryList.Any())
    {
        ModelState.AddModelError("CategoryList", "Please select at least one category.");
        ViewBag.AllergenOptions = _availableAllergens;
        ViewBag.CategoryOptions = _availableCategories;
        return View(viewModel);
    }

    if (ModelState.IsValid)
    {
        try
        {
            viewModel.UpdateProduct(product);
            await _productRepository.UpdateProductAsync(product);
            return RedirectToAction(nameof(Productsindex));
        }
        catch (DbUpdateConcurrencyException)
        {
            if (await _productRepository.GetProductByIdAsync(id) == null)
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            // Log the error
            Console.WriteLine($"Error updating product: {ex}");
            ModelState.AddModelError("", "An error occurred while updating the product.");
        }
    }

    ViewBag.AllergenOptions = _availableAllergens;
    ViewBag.CategoryOptions = _availableCategories;
    return View(viewModel);
}



    // GET: Products/Delete/{id} (only FoodProducers and Admins can delete products)
    [Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _productRepository.GetProductByIdAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        if (!IsAdmin() && product.ProducerId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return Forbid();
        }
        return View(product);
    }

    // POST: Products/Delete/{id}
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    [Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var product = await _productRepository.GetProductByIdAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        if (!IsAdmin() && product.ProducerId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return Forbid();
        }

        var success = await _productRepository.DeleteProductAsync(id);

        if (!success)
        {
            return BadRequest("Unable to delete product.");
        }

        return RedirectToAction(nameof(Productsindex));
    }

    // Private method to generate category options using TagBuilder
    private string GenerateCategoryOptions(string? selectedCategories)
    {
        var selectedCategoryList = string.IsNullOrEmpty(selectedCategories) ? new List<string>() : selectedCategories.Split(',').ToList();
        var selectList = new TagBuilder("select");

        selectList.Attributes.Add("name", "Category");
        selectList.Attributes.Add("id", "Category");
        selectList.Attributes.Add("class", "form-control");
        selectList.Attributes.Add("multiple", "multiple");
        selectList.Attributes.Add("required", "required");

        foreach (var category in _availableCategories)
        {
            var option = new TagBuilder("option");
            option.Attributes.Add("value", category);

            if (selectedCategoryList.Contains(category))
            {
                option.Attributes.Add("selected", "selected");
            }
            option.InnerHtml.Append(category);
            selectList.InnerHtml.AppendHtml(option);
        }

        var writer = new System.IO.StringWriter();
        selectList.WriteTo(writer, HtmlEncoder.Default);
        return writer.ToString();
    }

    // GET: Products/Index with sorting functionality
    public async Task<IActionResult> Index(string sortOrder, string currentSort, string sortDirection)
    {
        ViewData["CurrentSort"] = sortOrder;
        ViewData["CurrentDirection"] = sortDirection == "asc" ? "desc" : "asc";

        ViewData["NameSortParam"] = "Name";
        ViewData["CategorySortParam"] = "Category";
        ViewData["CaloriesSortParam"] = "Calories";
        ViewData["ProteinSortParam"] = "Protein";
        ViewData["FatSortParam"] = "Fat";
        ViewData["CarbohydratesSortParam"] = "Carbohydrates";

        var products = await _productRepository.GetAllProductsAsync();

        // Convert to IQueryable for sorting
        IQueryable<Product> productsQuery = products.AsQueryable();

        switch (sortOrder)
        {
            case "Name":
                productsQuery = sortDirection == "desc" ? productsQuery.OrderByDescending(p => p.Name) : productsQuery.OrderBy(p => p.Name);
                break;
            case "Category":
                productsQuery = sortDirection == "desc" ? productsQuery.OrderByDescending(p => p.Category) : productsQuery.OrderBy(p => p.Category);
                break;
            case "Calories":
                productsQuery = sortDirection == "desc" ? productsQuery.OrderByDescending(p => p.Calories) : productsQuery.OrderBy(p => p.Calories);
                break;
            case "Protein":
                productsQuery = sortDirection == "desc" ? productsQuery.OrderByDescending(p => p.Protein) : productsQuery.OrderBy(p => p.Protein);
                break;
            case "Fat":
                productsQuery = sortDirection == "desc" ? productsQuery.OrderByDescending(p => p.Fat) : productsQuery.OrderBy(p => p.Fat);
                break;
            case "Carbohydrates":
                productsQuery = sortDirection == "desc" ? productsQuery.OrderByDescending(p => p.Carbohydrates) : productsQuery.OrderBy(p => p.Carbohydrates);
                break;
            default:
                productsQuery = productsQuery.OrderBy(p => p.Name);
                break;
        }

        return View("ProductsIndex", productsQuery.ToList());
    }

    // GET: Products/UserProducts
    [Authorize(Roles = UserRoles.FoodProducer + "," + UserRoles.Administrator)]
    public async Task<IActionResult> UserProducts(string category)
    {
        // See if currentUserId get a value, dont need a valid ID
        string currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return BadRequest("User ID is invalid.");
        }
        // Retrieve products associated with the current producer
        var products = await _productRepository.GetProductsByProducerIdAsync(currentUserId);

        // Filter products by category if a category is selected
        if (!string.IsNullOrEmpty(category))
        {
            products = products.Where(p => p.CategoryList.Contains(category));
        }

        // Retrieve distinct categories from all products by this producer
        var allCategories = await _productRepository.GetAllCategoriesAsync();
        var categories = allCategories.OrderBy(c => c).ToList();

        ViewBag.Categories = categories;
        ViewBag.SelectedCategory = category;

        return View(products);
    }
}