namespace api.Models;

/// <summary>
/// Represents the request model for deleting a user account.
/// </summary>
public class DeleteAccountRequest
{
    /// <summary>
    /// The password of the user, used to confirm the account deletion.
    /// </summary>
    public string? Password { get; set; }
}
