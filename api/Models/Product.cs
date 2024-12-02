namespace api.Models 
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Microsoft.AspNetCore.Identity;

    public class Product 
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [NotMapped]
        public List<string> CategoryList
        {
            get => string.IsNullOrEmpty(Category) ? new List<string>() : Category.Split(',').ToList();
            set => Category = value != null ? string.Join(",", value) : string.Empty;
        }

        [Required]
        public double Calories { get; set; }

        [Required]
        public double Protein { get; set; }

        [Required]
        public double Carbohydrates { get; set; }

        [Required]
        public double Fat { get; set; }

        public string? Allergens { get; set; }

        public string? ProducerId { get; set; }

        [ForeignKey(nameof(ProducerId))]
        public IdentityUser? Producer { get; set; }
    }
}