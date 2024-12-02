namespace api.DAL.Interfaces;

using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

/// <summary>
/// Defines the contract for user management operations, including authentication, role management, and user retrieval.
/// </summary>
public interface IUserRepository
{
    /// <summary>
    /// Logs in a user with the specified credentials.
    /// </summary>
    /// <param name="username">The username of the user.</param>
    /// <param name="password">The user's password.</param>
    /// <returns>The result of the login attempt.</returns>
    Task<SignInResult> LoginAsync(string username, string password);

    /// <summary>
    /// Logs out the current user.
    /// </summary>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task LogoutAsync();

    /// <summary>
    /// Registers a new user with the specified credentials.
    /// </summary>
    /// <param name="username">The username of the new user.</param>
    /// <param name="password">The password for the new user.</param>
    /// <returns>The result of the registration attempt.</returns>
    Task<IdentityResult> RegisterAsync(string username, string password);

    /// <summary>
    /// Finds a user by their username.
    /// </summary>
    /// <param name="username">The username of the user to find.</param>
    /// <returns>The user if found.</returns>
    Task<IdentityUser> FindByNameAsync(string username);

    /// <summary>
    /// Retrieves the roles assigned to a user.
    /// </summary>
    /// <param name="user">The user whose roles to retrieve.</param>
    /// <returns>A list of roles assigned to the user.</returns>
    Task<IList<string>> GetRolesAsync(IdentityUser user);

    /// <summary>
    /// Checks if a user is in a specific role.
    /// </summary>
    /// <param name="user">The user to check.</param>
    /// <param name="role">The role to check.</param>
    /// <returns>True if the user is in the specified role; otherwise, false.</returns>
    Task<bool> IsInRoleAsync(IdentityUser user, string role);

    /// <summary>
    /// Adds a user to a specific role.
    /// </summary>
    /// <param name="user">The user to add to the role.</param>
    /// <param name="role">The role to assign to the user.</param>
    /// <returns>The result of the operation.</returns>
    Task<IdentityResult> AddToRoleAsync(IdentityUser user, string role);

    /// <summary>
    /// Changes the password for a user.
    /// </summary>
    /// <param name="user">The user whose password to change.</param>
    /// <param name="currentPassword">The user's current password.</param>
    /// <param name="newPassword">The new password to set.</param>
    /// <returns>The result of the password change operation.</returns>
    Task<IdentityResult> ChangePasswordAsync(IdentityUser user, string currentPassword, string newPassword);

    /// <summary>
    /// Deletes a user.
    /// </summary>
    /// <param name="user">The user to delete.</param>
    /// <returns>The result of the deletion operation.</returns>
    Task<IdentityResult> DeleteUserAsync(IdentityUser user);

    /// <summary>
    /// Removes a user from multiple roles.
    /// </summary>
    /// <param name="user">The user to remove from roles.</param>
    /// <param name="roles">The roles to remove.</param>
    /// <returns>The result of the operation.</returns>
    Task<IdentityResult> RemoveFromRolesAsync(IdentityUser user, IEnumerable<string> roles);

    /// <summary>
    /// Adds a user to multiple roles.
    /// </summary>
    /// <param name="user">The user to add to roles.</param>
    /// <param name="roles">The roles to assign to the user.</param>
    /// <returns>The result of the operation.</returns>
    Task<IdentityResult> AddToRolesAsync(IdentityUser user, IEnumerable<string> roles);

    /// <summary>
    /// Retrieves the user associated with the specified principal.
    /// </summary>
    /// <param name="principal">The claims principal representing the user.</param>
    /// <returns>The user associated with the principal.</returns>
    Task<IdentityUser> GetUserAsync(ClaimsPrincipal principal);

    /// <summary>
    /// Retrieves all users in the system.
    /// </summary>
    /// <returns>A list of all users.</returns>
    Task<List<IdentityUser>> GetAllUsersAsync();

    /// <summary>
    /// Retrieves all roles in the system.
    /// </summary>
    /// <returns>A list of all roles.</returns>
    Task<List<IdentityRole>> GetAllRolesAsync();

    /// <summary>
    /// Finds a user by their unique ID.
    /// </summary>
    /// <param name="userId">The unique ID of the user.</param>
    /// <returns>The user if found.</returns>
    Task<IdentityUser> FindByIdAsync(string userId);

    /// <summary>
    /// Checks if a specific role exists in the system.
    /// </summary>
    /// <param name="roleName">The name of the role to check.</param>
    /// <returns>True if the role exists; otherwise, false.</returns>
    Task<bool> RoleExistsAsync(string roleName);
}
