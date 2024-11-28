namespace api.Models;

/// <summary>
/// Provides constant values representing different user roles in the system.
/// </summary>
public static class UserRoles
{
    /// <summary>
    /// Represents a regular user role, typically for general users of the system.
    /// </summary>
    public const string RegularUser = "RegularUser";

    /// <summary>
    /// Represents the food producer role, typically assigned to users who create and manage product data.
    /// </summary>
    public const string FoodProducer = "FoodProducer";

    /// <summary>
    /// Represents the administrator role, typically assigned to users with elevated permissions to manage the system.
    /// </summary>
    public const string Administrator = "Administrator";
}
