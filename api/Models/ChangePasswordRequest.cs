namespace api.Models;

/// <summary>
/// Represents the request model for changing a user's password.
/// </summary>
public class ChangePasswordRequest
{
    /// <summary>
    /// The user's current password, required for authentication before changing the password.
    /// </summary>
    public string? CurrentPassword { get; set; }

    /// <summary>
    /// The new password the user wants to set.
    /// </summary>
    public string? NewPassword { get; set; }

    /// <summary>
    /// A confirmation of the new password to ensure it was entered correctly.
    /// </summary>
    public string? ConfirmPassword { get; set; }
}
