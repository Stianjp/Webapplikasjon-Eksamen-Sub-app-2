namespace api.DTO 
{
    public class ProductDTO
    {
        public int Id { get; set; } // Added to support updates and identification
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> CategoryList { get; set; } = new List<string>();
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Carbohydrates { get; set; }
        public double Fat { get; set; }
        public string? Allergens { get; set; } 
        public string? ProducerId { get; set; }
    }
}