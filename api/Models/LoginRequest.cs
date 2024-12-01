namespace api.Models;

/// <summary>
/// Represents the login request model containing the user's credentials.
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// The username of the user.
    /// </summary>
    public string? Username { get; set; }

    /// <summary>
    /// The password of the user.
    /// </summary>
    public string? Password { get; set; }
}
