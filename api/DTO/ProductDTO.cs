public class ProductDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public double Calories { get; set; }
    public double Protein { get; set; }
    public double Fat { get; set; }
    public double Carbohydrates { get; set; }
    public string ProducerId { get; set; }  // Added ProducerId
    public List<string> CategoryList { get; set; }  // Added CategoryList
}