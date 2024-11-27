namespace Sub_App_1.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using Sub_App_1.Models;
using Sub_App_1.ViewModels;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Menu()
    {
        return View();
    }

    public IActionResult Index()
    {
        /*if (User.Identity != null && User.Identity.IsAuthenticated)
        {
            return RedirectToAction("Productsindex", "Products");
        }*/
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}