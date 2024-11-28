namespace api.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

/// <summary>
/// Represents a product with nutritional information, category details, and producer association.
/// </summary>
public class Product
{
    /// <summary>
    /// Gets or sets the unique identifier for the product.
    /// </summary>
    [Key]
    public int Id { get; set; } // Primary Key

    /// <summary>
    /// Gets or sets the name of the product. This field is required.
    /// </summary>
    [Required]
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets the description of the product. This field is required.
    /// </summary>
    [Required]
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the categories associated with the product as a comma-separated string.
    /// </summary>
    [Required]
    public string? Category { get; set; }

    /// <summary>
    /// Gets or sets the categories as a list of strings (not mapped to the database).
    /// </summary>
    [NotMapped]
    public List<string> CategoryList
    {
        get => string.IsNullOrEmpty(Category) ? new List<string>() : Category.Split(',').ToList();
        set => Category = value != null ? string.Join(",", value) : null;
    }

    /// <summary>
    /// Gets or sets the calorie content of the product in kcal per 100g. This field is required.
    /// </summary>
    [Required]
    public double Calories { get; set; } // kcal per 100g

    /// <summary>
    /// Gets or sets the protein content of the product in grams per 100g. This field is required.
    /// </summary>
    [Required]
    public double Protein { get; set; } // grams per 100g

    /// <summary>
    /// Gets or sets the carbohydrate content of the product in grams per 100g. This field is required.
    /// </summary>
    [Required]
    public double Carbohydrates { get; set; } // grams per 100g

    /// <summary>
    /// Gets or sets the fat content of the product in grams per 100g. This field is required.
    /// </summary>
    [Required]
    public double Fat { get; set; } // grams per 100g

    /// <summary>
    /// Gets or sets the allergens associated with the product, stored as a comma-separated string.
    /// </summary>
    public string? Allergens { get; set; }

    /// <summary>
    /// Gets or sets the unique identifier for the producer who created the product.
    /// </summary>
    public string? ProducerId { get; set; } // Nullable foreign key

    /// <summary>
    /// Gets or sets the navigation property for the producer associated with the product.
    /// </summary>
    [ForeignKey(nameof(ProducerId))]
    public IdentityUser? Producer { get; set; }
}
