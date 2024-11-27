using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;  // For Any() extension method
using Sub_App_1.Models;

namespace Sub_App_1.ViewModels
{
    public class ProductFormViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Description is required")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "At least one category must be selected")]
        public List<string> CategoryList { get; set; } = new List<string>();

        // Store categories as a comma-separated string
        public string? Category { get; set; }

        [Required(ErrorMessage = "Calories value is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Please enter a valid calories value")]
        public double Calories { get; set; }

        [Required(ErrorMessage = "Protein value is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Please enter a valid protein value")]
        public double Protein { get; set; }

        [Required(ErrorMessage = "Fat value is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Please enter a valid fat value")]
        public double Fat { get; set; }

        [Required(ErrorMessage = "Carbohydrates value is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Please enter a valid carbohydrates value")]
        public double Carbohydrates { get; set; }

        public string? Allergens { get; set; }
        public List<string> SelectedAllergens { get; set; } = new List<string>();

        [Required]
        public string? ProducerId { get; set; }

        // Helper properties
        public bool IsEdit => Id != 0;
        public string PageTitle => IsEdit ? "Edit Product" : "Create Product";
        public string SubmitButtonText => IsEdit ? "Save changes" : "Save";

        // Convert from Product to ViewModel
        public static ProductFormViewModel FromProduct(Product product)
        {
            return new ProductFormViewModel
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                CategoryList = product.CategoryList,
                Category = product.Category,
                Calories = product.Calories,
                Protein = product.Protein,
                Fat = product.Fat,
                Carbohydrates = product.Carbohydrates,
                Allergens = product.Allergens,
                SelectedAllergens = product.Allergens?.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>(),
                ProducerId = product.ProducerId
            };
        }

        // Convert to Product
        public Product ToProduct()
        {
            return new Product
            {
                Id = Id,
                Name = Name,
                Description = Description,
                CategoryList = CategoryList,
                Calories = Calories,
                Protein = Protein,
                Fat = Fat,
                Carbohydrates = Carbohydrates,
                Allergens = SelectedAllergens?.Any() == true ? string.Join(",", SelectedAllergens) : null,
                ProducerId = ProducerId
            };
        }

        // Update existing Product
        public void UpdateProduct(Product product)
        {
            product.Name = Name;
            product.Description = Description;
            product.CategoryList = CategoryList;
            product.Calories = Calories;
            product.Protein = Protein;
            product.Fat = Fat;
            product.Carbohydrates = Carbohydrates;
            product.Allergens = SelectedAllergens?.Any() == true ? string.Join(",", SelectedAllergens) : null;
            if (!string.IsNullOrEmpty(ProducerId))
            {
                product.ProducerId = ProducerId;
            }
        }
    }
}