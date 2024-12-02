namespace api.Models 
{
   using System.ComponentModel.DataAnnotations;
   using System.ComponentModel.DataAnnotations.Schema;
   using Microsoft.AspNetCore.Identity;

   /// <summary>
   /// Represents a food product in the system with nutritional information and allergens
   /// </summary>
   public class Product 
   {
       /// <summary>
       /// Unique identifier for the product
       /// </summary>
       [Key]
       public int Id { get; set; }

       /// <summary>
       /// Name of the product. Cannot be empty.
       /// </summary>
       [Required]
       public string Name { get; set; } = string.Empty;

       /// <summary>
       /// Description of the product. Cannot be empty.
       /// </summary>
       [Required]
       public string Description { get; set; } = string.Empty;

       /// <summary>
       /// Comma-separated string of categories. Cannot be empty.
       /// </summary>
       [Required]
       public string Category { get; set; } = string.Empty;

       /// <summary>
       /// List of categories for the product.
       /// Converts comma-separated Category string to/from List<string>.
       /// Not stored in database.
       /// </summary>
       [NotMapped]
       public List<string> CategoryList
       {
           get => string.IsNullOrEmpty(Category) ? new List<string>() : Category.Split(',').ToList();
           set => Category = value != null ? string.Join(",", value) : string.Empty;
       }

       /// <summary>
       /// Calories per 100g of product. Cannot be empty.
       /// </summary>
       [Required]
       public double Calories { get; set; }

       /// <summary>
       /// Protein content in grams per 100g of product. Cannot be empty.
       /// </summary>
       [Required]
       public double Protein { get; set; }

       /// <summary>
       /// Carbohydrate content in grams per 100g of product. Cannot be empty.
       /// </summary>
       [Required]
       public double Carbohydrates { get; set; }

       /// <summary>
       /// Fat content in grams per 100g of product. Cannot be empty.
       /// </summary>
       [Required]
       public double Fat { get; set; }

       /// <summary>
       /// Comma-separated list of allergens present in the product.
       /// Optional field.
       /// </summary>
       public string? Allergens { get; set; }

       /// <summary>
       /// ID of the user who produced/added this product.
       /// Optional field.
       /// </summary>
       public string? ProducerId { get; set; }

       /// <summary>
       /// Navigation property to the user who produced/added this product.
       /// Links to IdentityUser via ProducerId foreign key.
       /// </summary>
       [ForeignKey(nameof(ProducerId))]
       public IdentityUser? Producer { get; set; }
   }
}