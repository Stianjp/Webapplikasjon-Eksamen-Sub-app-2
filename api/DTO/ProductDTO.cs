namespace api.DTO 
{
   /// <summary>
   /// Data Transfer Object for Product. Used for transferring product data between client and server
   /// without exposing the internal model structure.
   /// </summary>
   public class ProductDTO
   {
       /// <summary>
       /// Unique identifier for the product.
       /// Used for updating existing products and identification.
       /// </summary>
       public int Id { get; set; }

       /// <summary>
       /// Name of the product.
       /// Cannot be empty.
       /// </summary>
       public string Name { get; set; } = string.Empty;

       /// <summary>
       /// Description of the product.
       /// Cannot be empty.
       /// </summary>
       public string Description { get; set; } = string.Empty;

       /// <summary>
       /// List of categories the product belongs to.
       /// Initialized as empty list.
       /// </summary>
       public List<string> CategoryList { get; set; } = new List<string>();

       /// <summary>
       /// Calories per 100g of product.
       /// </summary>
       public double Calories { get; set; }

       /// <summary>
       /// Protein content in grams per 100g of product.
       /// </summary>
       public double Protein { get; set; }

       /// <summary>
       /// Carbohydrate content in grams per 100g of product.
       /// </summary>
       public double Carbohydrates { get; set; }

       /// <summary>
       /// Fat content in grams per 100g of product.
       /// </summary>
       public double Fat { get; set; }

       /// <summary>
       /// Comma-separated list of allergens in the product.
       /// Optional field.
       /// </summary>
       public string? Allergens { get; set; }

       /// <summary>
       /// ID of the user who produced/added this product.
       /// Optional field.
       /// </summary>
       public string? ProducerId { get; set; }
   }
}