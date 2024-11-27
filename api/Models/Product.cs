namespace Sub_App_1.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

public class Product
{
    [Key]
    public int Id { get; set; } // Primary Key

    [Required]
    public string? Name { get; set; }

    [Required]
    public string? Description { get; set; }

    // Store categories as a comma-separated string
    [Required]
    public string? Category { get; set; }

    // Not mapped property for handling categories as a list
    [NotMapped]
    public List<string> CategoryList
    {
        get => string.IsNullOrEmpty(Category) ? new List<string>() : Category.Split(',').ToList();
        set => Category = value != null ? string.Join(",", value) : null;
    }

    // Nutritional Information
    [Required]
    public double Calories { get; set; } // kcal per 100g

    [Required]
    public double Protein { get; set; } // grams per 100g

    [Required]
    public double Carbohydrates { get; set; } // grams per 100g

    [Required]
    public double Fat { get; set; } // grams per 100g

    public string? Allergens { get; set; }

    // Foreign Key to the producer
    [Required]
    [ForeignKey("Producer")]
    public string? ProducerId { get; set; }

    // Remove [Required] attribute from Producer
    public IdentityUser? Producer { get; set; }
}