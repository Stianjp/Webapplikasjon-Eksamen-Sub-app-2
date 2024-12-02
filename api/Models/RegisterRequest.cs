namespace api.Models;

/// <summary>
/// Represents the request model for user registration, including credentials and role assignment.
/// </summary>
public class RegisterRequest
{
    /// <summary>
    /// Gets or sets the username for the new user.
    /// </summary>
    public string? Username { get; set; }

    /// <summary>
    /// Gets or sets the password for the new user.
    /// </summary>
    public string? Password { get; set; }

    /// <summary>
    /// Gets or sets the confirmation of the password to ensure it matches the specified password.
    /// </summary>
    public string? ConfirmPassword { get; set; }

    /// <summary>
    /// Gets or sets the role to be assigned to the new user. Defaults to a regular user role if not specified.
    /// </summary>
    public string? Role { get; set; }
}
