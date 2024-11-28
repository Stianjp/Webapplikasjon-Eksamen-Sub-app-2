namespace api.Models;

/// <summary>
/// Represents a user with their associated roles, typically used for administrative purposes.
/// </summary>
public class UserWithRolesViewModel
{
    /// <summary>
    /// Gets or sets the unique identifier of the user.
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// Gets or sets the username of the user.
    /// </summary>
    public string Username { get; set; }

    /// <summary>
    /// Gets or sets the list of roles assigned to the user.
    /// </summary>
    public IList<string> Roles { get; set; }

    /// <summary>
    /// Initializes a new instance of the <see cref="UserWithRolesViewModel"/> class
    /// with default values for the properties.
    /// </summary>
    public UserWithRolesViewModel()
    {
        UserId = string.Empty;
        Username = string.Empty;
        Roles = new List<string>();
    }
}
